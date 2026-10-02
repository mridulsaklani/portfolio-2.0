export function getContactEndpoint(): URL | null {
  const configuredEndpoint = process.env.CONTACT_FORM_ENDPOINT?.trim();
  if (!configuredEndpoint) return null;

  try {
    const endpoint = new URL(configuredEndpoint);
    const isLocalDevelopmentEndpoint =
      endpoint.protocol === "http:" && ["localhost", "127.0.0.1"].includes(endpoint.hostname);
    if (endpoint.protocol !== "https:" && !isLocalDevelopmentEndpoint) return null;
    return endpoint;
  } catch {
    return null;
  }
}
