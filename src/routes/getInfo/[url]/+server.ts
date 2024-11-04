import puppeteer from 'puppeteer';
import { json } from '@sveltejs/kit';
import { chromium } from 'playwright';

export async function GET({ params }) {
	const browser = await chromium.launch();
	const page = await browser.newPage();
	const url = params.url;
	try {
		await page.goto(url.replaceAll('*', '/'));
		await page.waitForSelector('tr.ng-star-inserted');
		const data = await page.evaluate(() => {
			const rows = document.querySelectorAll('tr.ng-star-inserted');
			type Athlete = {
				grade: string;
				name: string;
				time: string;
				team: string;
				division: string;
				place: number;
			};

			type School = {
				name: string;
				image: string;
				score: number;
				finishers: number;
				finished: boolean;
				athletes: Athlete[];
			};
			let athletes: Athlete[] = [];
			let teams = {};
			let meetName = document.querySelector('h2.mb-1.me-2.text-nowrap.overflow-hidden');

			rows.forEach((row) => {
				let athlete: Athlete = {};
				athlete.grade = row.querySelector('td:nth-child(2)').innerText;

				athlete.name = row.querySelector('td:nth-child(3)').innerText;
				athlete.time = row.querySelector('td:nth-child(5)').innerText;
				athlete.team = row.querySelector('td:nth-child(7)').innerText;
				athlete.division = row.querySelector('td:nth-child(8)').innerText;
				athlete.place = 0;
				if (!teams[athlete['team']]) {
					teams[athlete['team']] = {
						name: athlete['team'],
						image: row.querySelector('td:nth-child(6) img').src,
						score: 0,
						finishers: 0,
						finished: false,
						athletes: []
					};
				}

				athletes.push(athlete);
			});
			return {
				athletes,
				teams,
				meetName: meetName?.innerText
			};
		});
		await browser.close();
		return json({
			athletes: data.athletes,
			teams: data.teams,
			meetName: data.meetName
		});
	} catch (error) {
		console.log(error);
		return json({
			error: 'Invalid URL'
		});
	}
}
