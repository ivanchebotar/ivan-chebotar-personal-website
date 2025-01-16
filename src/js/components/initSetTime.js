export default function initSetTime () {
  const currentYear = new Date().getFullYear();
  const devYear = document.getElementById("dev-year");

  document.getElementById("year").innerHTML = currentYear;

  if (devYear) {
    devYear.innerHTML = (currentYear - 2025);
  }
}
