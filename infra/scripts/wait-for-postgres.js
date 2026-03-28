const { exec } = require("node:child_process");

function checkPostgres() {
  exec("pg_isready -h database -U postgres", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("postgres is ready!");
  }
}

process.stdout.write("Waiting for postgres to accept connections");
checkPostgres();
