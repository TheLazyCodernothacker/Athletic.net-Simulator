<script>
	import { onMount } from 'svelte';

	async function getData(url) {
		const res = await fetch(`/getInfo/${url}`);
		const data = await res.json();
		return data;
	}
	function calculate(data) {
		Object.keys(data.teams).forEach((team) => {
			data.teams[team].score = 0;
			data.teams[team].finishers = 0;
			data.teams[team].athletes = [];
			data.teams[team].finished = false;
		});
		data.athletes = data.athletes?.sort((a, b) => getTime(a.time) - getTime(b.time));
		data.athletes?.forEach((athlete, i) => {
			athlete.place = i + 1;
			let scoringTeam = data.teams[athlete.team];
			if (scoringTeam) {
				if (!scoringTeam.finished) scoringTeam.score += i + 1;
				scoringTeam.athletes.push(athlete);
				scoringTeam.finishers++;
				if (scoringTeam.finishers == 5) {
					scoringTeam.finished = true;
				}
			}
		});
		console.log('done');
		console.log(data);
	}
	function getTime(time) {
		let timeArray = time.split(':');
		let increments = [1000, 60000, 3600000];
		let timeInMilliseconds = 0;
		let k = 0;
		for (let i = timeArray.length - 1; i >= 0; i--) {
			timeInMilliseconds += parseFloat(timeArray[k]) * increments[i];
			k++;
		}
		return timeInMilliseconds;
	}
	const props = $props();

	let data = $state(null);
	let displayData = $state(null);
	onMount(async () => {
		data = await getData(props.data.url);
		displayData = data;
		calculate(displayData);
	});
	$effect(() => {
		displayData = data;
		calculate(displayData);
	});

	let displayTeam = $state('');
</script>

{#if !data}
	<div class="loading-overlay">
		<div class="spinner"></div>
	</div>
{:else}
	<div class="container mx-auto px-4">
		{#if data.error}
			<p class="font-bold text-red-500">{data.error}</p>
		{:else}
			<h1 class="my-6 text-center text-5xl font-bold">{data.meetName}</h1>
			<!-- Team Standings -->
			<section class="mb-8">
				<h2 class="mb-4 text-2xl font-semibold">Team Standings</h2>
				<div class="grid grid-cols-1 gap-4">
					{#each Object.values(data.teams)
						.filter((a) => a.finished)
						.sort((a, b) => a.score - b.score) as team}
						<div class="flex items-center gap-2 rounded-lg bg-gray-200 p-4 shadow">
							<div class="flex items-center">
								<img src={team.image} alt="{team.name} logo" class="mr-4 h-10 w-10 rounded-full" />
								<div>
									<p class="font-medium text-gray-800">{team.name}</p>
									<p class="text-sm text-gray-600">Score: {team.score}</p>
								</div>
							</div>
							<button
								onclick={() => {
									displayTeam = team.name === displayTeam ? '' : team.name;
								}}
								class="ml-auto rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
								>{displayTeam === team.name ? 'Close' : 'View Athletes'}</button
							>
						</div>
						{#if displayTeam === team.name}
							<div class="mx-auto my-4 flex w-1/2 flex-col gap-2">
								{#each team.athletes as athlete}
									<div class="flex">
										<img src={team.image} alt="{team.name} logo" class="h-6 w-6 rounded-full" />
										<p class="ml-2">{athlete.place}</p>
										<p class="ml-2">{athlete.name}</p>
										<p class="ml-auto">{athlete.time}</p>
									</div>
								{/each}
							</div>
						{/if}
					{/each}
					<h2 class="my-4 text-2xl font-semibold">Incomplete Teams</h2>
					{#each Object.values(data.teams)
						.filter((a) => !a.finished)
						.sort((a, b) => b.finishers - a.finishers) as team}
						<div class="flex items-center gap-2 rounded-lg bg-gray-200 p-4 shadow">
							<div class="flex items-center">
								<img src={team.image} alt="{team.name} logo" class="mr-4 h-10 w-10 rounded-full" />
								<div>
									<p class="font-medium text-gray-800">{team.name}</p>
									<p class="text-sm text-gray-600">{team.finishers} finished</p>
								</div>
							</div>
							<button
								onclick={() => {
									displayTeam = team.name === displayTeam ? '' : team.name;
								}}
								class="ml-auto rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
								>{displayTeam === team.name ? 'Close' : 'View Athletes'}</button
							>
						</div>
						{#if displayTeam === team.name}
							<div class="mx-auto my-4 flex w-1/2 flex-col gap-2">
								{#each team.athletes as athlete}
									<div class="flex">
										<img src={team.image} alt="{team.name} logo" class="h-6 w-6 rounded-full" />
										<p class="ml-2">{athlete.place}</p>
										<p class="ml-2">{athlete.name}</p>
										<p class="ml-auto">{athlete.time}</p>
									</div>
								{/each}
							</div>
						{/if}
					{/each}
				</div>
			</section>

			<!-- Athlete Results -->
			<section>
				<h2 class="mb-4 text-2xl font-semibold">Athlete Results</h2>
				<div class="overflow-x-auto">
					<table class="w-full divide-y divide-gray-200">
						<thead class="bg-gray-100">
							<tr>
								<th
									class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
									>Place</th
								>
								<th
									class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
									>Name</th
								>
								<th
									class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
									>Time</th
								>
								<th
									class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
									>Grade</th
								>
								<th
									class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
									>Team</th
								>
								<th
									class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
									>Division</th
								>
								<th
									class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
									>Logo</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each data.athletes as athlete}
								<tr class="hover:bg-gray-50">
									<td class="whitespace-nowrap px-4 py-2 text-sm text-gray-800">{athlete.place}</td>
									<td class="whitespace-nowrap px-4 py-2 text-sm text-gray-800">{athlete.name}</td>
									<td class="whitespace-nowrap px-4 py-2 text-sm text-gray-800">{athlete.time}</td>
									<td class="whitespace-nowrap px-4 py-2 text-sm text-gray-800">{athlete.grade}</td>
									<td class="whitespace-nowrap px-4 py-2 text-sm text-gray-800">{athlete.team}</td>
									<td class="whitespace-nowrap px-4 py-2 text-sm text-gray-800"
										>{athlete.division}</td
									>
									<td class="whitespace-nowrap px-4 py-2">
										<img
											src={data.teams[athlete.team]?.image}
											alt="{athlete.team} logo"
											class="h-6 w-6 rounded-full"
										/>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/if}
	</div>
{/if}

<svelte:head>
	<title>{data ? data.meetName : 'Loading...'}</title>
</svelte:head>

<style>
	/* Full-screen overlay */
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	/* Spinner styles */
	.spinner {
		width: 60px;
		height: 60px;
		border: 8px solid rgba(51, 51, 51, 0.3);
		border-top: 8px solid rgb(172, 172, 172);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	/* Spinner animation */
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
