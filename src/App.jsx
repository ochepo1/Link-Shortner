import { Copy } from "lucide-react";
import React, { useState } from "react";
import Footer from "./Footer.jsx";

const App = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const shortenUrl = async () => {
    setShortUrl("");
    setError(null);
    setIsLoading(true);

    if (!longUrl) {
      setError("Please enter a URL to shorten.");
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
        longUrl
      )}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();

      if (data.startsWith("http")) {
        setShortUrl(data);
      } else {
        throw new Error(`Error from TinyURL: ${data}`);
      }
    } catch (err) {
      console.error("Error shortening URL:", err);
      setError(`Failed to shorten URL: ${err.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard
        .writeText(shortUrl)
        .then(() => alert("New URL Copied to Clipboard!"))
        .catch((err) => console.error("Failed to copy:", err));
    }
  };

  return (
    <div class="selection:bg-orange-400 text-white absolute inset-0 -z-10 min-h-[100vh] md:w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="md:flex items-center justify-center md:pr-40 md:pl-40 w-[100%]">
        <div className="grid items-center">
          <h1 className="flex items-center justify-center text-white text-3xl md:text-6xl  pb-9 md:pb-15">URL Shortener</h1>
          <div className="md:flex grid grid-cols-1 items-center justify-between md:w-xl gap-4">
            <input
              type="text"
              placeholder="Shorten your link..."
              className="border-0  outline-0 md:w-103 w-full md:h-12 rounded-full pr-5 pl-6 pt-3 pb-3 bg-white text-gray-600"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  shortUrl;
                }
              }}
            />
            <button className="bg-orange-500 pt-2 pl-5 pr-5 pb-2 font-semibold rounded-3xl h-12 w-35 hover:bg-orange-600"
              onClick={shortenUrl}
              disabled={isLoading}
            >
              {isLoading? "Shortening..." : "shorten URL"}
            </button>
          </div>
          {error && (
            <p className="text-red-400 mt-4 text-center">{error}</p>
          )}
          {shortUrl && (
            <div className="flex items-center">
              <div
                className="cursor-pointer md:w-[50%] w-full flex items-center gap-10 justify-between pt-3 pl-4 bg-gray-700 p-3 rounded-lg mt-6" // Added some styling for the output
                onClick={copyToClipboard}
              >
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                  {shortUrl}
                </a>
                <Copy className="text-sm text-gray-300 hover:text-white" />
              </div>
            </div>
          )}
          </div>
        </div>
        <Footer />
      </div>
  )
};

export default App;
