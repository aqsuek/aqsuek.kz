/*
 * DauysTap баптауы.
 *
 * keyServer — Soniox кілтін жасырып ұстайтын кілт серверінің мекенжайы
 *             (worker/ папкасындағы Cloudflare Worker). Ол браузерге 5 минуттық
 *             уақытша кілт береді, негізгі кілт ешкімге көрінбейді. ҰСЫНЫЛАДЫ.
 *
 * apiKey    — Soniox кілтін тікелей осында жазу. GitHub Pages-те бұл файлды кез
 *             келген адам ашып оқи алады, сондықтан кілт ұрлануы мүмкін.
 *             keyServer бос болғанда ғана қолданылады.
 */
window.DAUYSTAP_CONFIG = {
  keyServer: "https://dauystap-key.ekunat00.workers.dev",
  apiKey: ""
};
