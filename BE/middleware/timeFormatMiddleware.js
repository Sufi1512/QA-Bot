const normalizeTime = (timeStr) => {
  // Handle various time formats
  const timeFormats = [
    /^(\d{1,2}):(\d{2})$/, // HH:mm or H:mm
    /^(\d{1,2}):(\d{2}):(\d{2})$/, // HH:mm:ss or H:mm:ss
    /^(\d{1,2}):(\d{2})\s*(am|pm)$/i, // HH:mm AM/PM
  ];

  for (const format of timeFormats) {
    const match = timeStr.match(format);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2];

      // Handle AM/PM if present
      if (match[3] && match[3].toLowerCase() === "pm" && hours < 12) {
        hours += 12;
      }
      if (match[3] && match[3].toLowerCase() === "am" && hours === 12) {
        hours = 0;
      }

      // Ensure 24-hour format
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    }
  }
  throw new Error("Invalid time format");
};

const timeFormatMiddleware = (req, res, next) => {
  if (req.body.time) {
    try {
      req.body.time = normalizeTime(req.body.time);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid time format. Use HH:mm format" });
    }
  }
  next();
};

module.exports = timeFormatMiddleware;
