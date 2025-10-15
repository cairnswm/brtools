let accessElfApikey = "";
const accessElfTrackerUrl = "https://accesself.co.za/php/api/track.php";

export const setApiKey = (key) => {
  console.log("Setting new APIKey", key);
  accessElfApikey = key;
};

const accessElfDebounceMap = new Map();

const sendAccessElfTracking = (page, id, message) => {
  const key = (page??"") + "-" + (id??"") + "-" + (message??"");
  const payload = {
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

export const track = (page, id) => {
  sendAccessElfTracking(page, id);
};

export const error = (page, id, message) => {
  sendAccessElfTracking(page, id, message);
};

export const accessElf = {
  track,
  error,
  setApiKey,
  apiKey: accessElfApikey,
}