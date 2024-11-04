<script>
	let url = $state('');
</script>

<head>
	<title>Athletic.net Simulator</title>
</head>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="container max-w-md rounded-lg bg-white p-8 text-center shadow-md">
		<h1 class="mb-4 text-2xl font-bold text-gray-800">
			Welcome to the Free Athletic.net Simulator
		</h1>
		<p class="mb-6 text-gray-600">Enter a URL to simulate</p>

		<input
			bind:value={url}
			type="text"
			placeholder="Enter URL here"
			class="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>

		<button
			onclick={() => {
				window.location = `/race/${url.replaceAll('/', '*')}/`;
			}}
			class="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
		>
			Submit
		</button>
	</div>
</div>
