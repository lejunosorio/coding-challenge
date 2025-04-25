'use client';
import { useState } from "react";

export default function Home() {

  const [delayInput, setDelayInput] = useState();
  const [unitInput, setUnitInput] = useState('seconds');
  const [messageInput, setMessageInput] = useState('');
  const [webhookUrlInput, setWebhookUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function sendWebhookMessage(){

    const delayInMilliseconds = (() => {
      if (unitInput === 'seconds') {
        return delayInput * 1000;
      } else if (unitInput === 'minutes') {
        return delayInput * 60 * 1000;
      } else if (unitInput === 'hours') {
        return delayInput * 60 * 60 * 1000;
      }
      return 0;
    })();

    if (delayInMilliseconds > 0) {
      await new Promise((resolve) => {
        setIsLoading(true);
        setTimeout(resolve, delayInMilliseconds)
      }).then(() => {
        setIsLoading(false);
      });
    }

    const payload = {
      "text": "From Lejun Christian L. Osorio's Slack Bot: " + messageInput,
    }


    const response = await fetch(webhookUrlInput, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('Message sent successfully');
    } else {
      console.error('Error sending message');
    }
  }

  function getButtonText() {
    if (isLoading) {
      return "Sending...";
    }

    if (!delayInput || delayInput === 0) {
      return "Send";
    } else if (delayInput === 1) {
      if (unitInput === 'seconds') {
        return "Send in 1 second";
      }
      if (unitInput === 'minutes') {
        return "Send in 1 minute";
      }
      if (unitInput === 'hours') {
        return "Send in 1 hour";
      }
    }
    return `Send in ${delayInput} ${unitInput}`;
  }

  function isButtonDisabled() {
    return !delayInput || !messageInput || !webhookUrlInput || isLoading;
  }

  return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Slack Message Scheduler</h1>
        <form className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4 flex items-center space-x-4">
            <div className="flex-1">
              <label htmlFor="delay" className="block text-sm font-medium text-gray-700">
              Delay
              </label>
              <div className="flex">
              <input
                type="number"
                id="delay"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter delay"
                onChange={(e) => setDelayInput(parseInt(e.target.value))}
                value={delayInput}
              />
              <select
                id="unit"
                className="ml-2 mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setUnitInput(e.target.value)}
                value={unitInput}
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Slack Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your message"
              onChange={(e) => setMessageInput(e.target.value)}
              value={messageInput}
            ></textarea>
          </div>
          <div>
            <label htmlFor="slack_webhook_url" className="block text-sm font-medium text-gray-700">
              Slack Webhook URL
            </label>
            <input
              type="text"
              id="webhook_url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter Webhook URL"
              onChange={(e) => setWebhookUrlInput(e.target.value)}
              value={webhookUrlInput}
            />
          </div>
          <div className="flex justify-center">
            <button 
              className={"mt-4 px-4 py-2 text-white rounded " + (isButtonDisabled() ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600")}
              onClick={(e) => {
              e.preventDefault();
              sendWebhookMessage();
              }}

              disabled={isButtonDisabled()}
            >
              {getButtonText()}
            </button>
          </div>
        </form>
      </div>
  );
}