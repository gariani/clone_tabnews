import useSWR from "swr";

async function fetchAPI() {
  const response = await fetch("/api/v1/status");
  const responseBody = await response.json();
  return responseBody;
}

function StatusPage() {
  return (
    <div>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </div>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI);

  let updatedAtText = "Loading";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Last time updated: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI);

  let databbaseStatusInformation = "Loading...";

  if (!isLoading && data) {
    databbaseStatusInformation = (
      <>
        <div>Version: {data.db_version}</div>
        <div>Opened connections: {data.db_total_active_connections}</div>
        <div>Max connections supported: {data.db_max_conn}</div>
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>
      <div>{databbaseStatusInformation}</div>
    </>
  );
}

export default StatusPage;
