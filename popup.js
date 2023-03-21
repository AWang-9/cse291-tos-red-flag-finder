document.addEventListener("DOMContentLoaded", () => {
    const page_data = document.getElementById("page_data");
    let currentUrl;
  
    function setCurrentURL(url) {
      page_data.querySelector(".current_url").textContent = url;
    }
  
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      currentUrl = tabs[0].url;
      currentUrl = new URL(currentUrl).hostname;
      console.log("Current URL:", currentUrl); // Print the current URL to the console
      setCurrentURL(currentUrl);
    });
  
    document.getElementById("analyze_tos").addEventListener("click", async () => {
      // Remove the previous summary element if it exists
      const oldSummaryElement = document.getElementById("summary");
      if (oldSummaryElement) {
        page_data.removeChild(oldSummaryElement);
      }
  
      const summary = await analyzeTOS(currentUrl);
      const summaryElement = document.createElement("p");
      summaryElement.id = "summary"; // Assign an ID to the summary element
      summaryElement.textContent = summary;
      page_data.appendChild(summaryElement);
    });
  
    async function chatGPTRequest(prompt) {
      const apiKey = "API-KEY"; // Replace with your actual OpenAI API key
  
      const response = await fetch(
        // "https://api.openai.com/v1/engines/davinci-codex/completions",
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": prompt}],
          }),
        }
      );
  
      const data = await response.json();
      const summary = data.choices[0].message.content;
      return summary;
    }
  
    // TODO
    async function analyzeTOS(url) {
      // const extractedTOSContent = extractTOS(url);
      // const prompt = `Analyze the Terms of Service of this website: ${url}. List 5 key privacy rights that the website asks from the user in <8 words, starting each bullet point with a number (don't include anything besides the bullets in your response like "Sure, here are 5 key privacy rights...", just give the answer directly!). Include points that a user might find most worrying or harmful.`;
      const prompt = `For the website "${url}", list the 5 most worrying or harmful privacy concerns based on their terms of service. List the 5 points in numerican order, with no more tha 8 words each. Only include the answer directly in the response.`
 
      console.log("Prompt:", prompt);
      const summary = await chatGPTRequest(prompt);
      console.log("Summary:", summary);
      return summary;
    }
  });