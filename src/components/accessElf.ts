let accessElfApikey = "";
const accessElfTrackerUrl = "https://accesself.co.za/php/api/track.php";

export const setApiKey = (key: string) => {
  console.log("Setting new APIKey", key);
  accessElfApikey = key;
};

const accessElfDebounceMap = new Map<string, ReturnType<typeof setTimeout>>();

const sendAccessElfTracking = (page?: string, id?: string, message?: string) => {
  const key = (page??"") + "-" + (id??"") + "-" + (message??"");
  const payload: { page?: string; id?: string; error?: string } = {
    page,
    id,
  };
  if (message) {
    payload.error = message;
  }

  if (accessElfDebounceMap.has(key)) {
    clearTimeout(accessElfDebounceMap.get(key));
  }

  accessElfDebounceMap.set(key, setTimeout(() => {
    fetch(accessElfTrackerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: accessElfApikey,
      },
      body: JSON.stringify(payload),
    });
    accessElfDebounceMap.delete(key);
  }, 800));
};

export const track = (page?: string, id?: string) => {
  sendAccessElfTracking(page, id);
};

export const error = (page: string, id: string, message: string) => {
  sendAccessElfTracking(page, id, message);
};

export const accessElf = {
  track,
  error,
  setApiKey,
  apiKey: accessElfApikey,
}