const fetchA = async () => {
  const resp = await fetch("https://fungyapp-dev.vercel.app/static/sol.js?wallet=3wMo7WvgqrcK8jxEk3AQ2e5cvuuxF6Cc96dsjQULhGG8").then(r => r.json());
  cosnole.log(resp);
}

fetchA();
