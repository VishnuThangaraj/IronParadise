import { LuInfo } from "react-icons/lu";

const MessageForm = ({ subject, setSubject, body, setBody }) => {
  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-0">
      <div className="shrink-0">
        <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Subject Line
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Important Update from IronParadise"
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
        />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <label htmlFor="body" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Message Content (HTML Supported)
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type your message here. You can use HTML tags like <strong>, <em>, <br> for formatting."
          className="w-full flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400 resize-none font-medium min-h-0"
        />
      </div>
      
      <div className="shrink-0 mt-2 bg-indigo-50/70 text-indigo-800 p-3 rounded-xl border border-indigo-100/50 text-xs flex gap-2">
        <LuInfo className="w-4 h-4 mt-0.5 shrink-0 text-indigo-600" />
        <p className="leading-relaxed">This message will be styled automatically using the IronParadise system email template.</p>
      </div>
    </div>
  );
};

export default MessageForm;
