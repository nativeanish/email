import { Download, Send, Archive, Forward, ShieldAlert } from "lucide-react";
function EC() {
  return (
    <div className="h-full flex flex-col">
      {/* Pink Header Section */}
      <div className="flex-shrink-0 bg-pink-300 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">Subject</h3>
          </div>
          <div className="text-sm text-gray-700">
            icons for download, forward, move to spam, move to archive
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">From</h3>
          </div>
          <div className="flex-1 text-right">
            <h3 className="text-lg font-semibold text-gray-800">Date</h3>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <button className="p-2 hover:bg-pink-400 rounded-lg transition-colors">
            <Download className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-pink-400 rounded-lg transition-colors">
            <Forward className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-pink-400 rounded-lg transition-colors">
            <ShieldAlert className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-pink-400 rounded-lg transition-colors">
            <Archive className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* White Content Area */}
      <div
        className="flex-1 bg-white overflow-y-auto p-8 min-h-0"
        style={{ maxHeight: "60vh" }}
      >
        <div className="max-w-none prose">
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium text-gray-800 mb-4">
              Email content to display (it could have a scroll bar if the
              content is overflow, not the outside window or main scroll bar to
              have
            </h2>
          </div>

          {/* Sample long content to demonstrate scrolling */}
          <div className="space-y-4 text-gray-700">
            <p>Hi John,</p>
            <p>
              I hope this message finds you well! I'm reaching out to explore a
              potential partnership between our companies. At Jane Corp, which
              could complement your offerings at John Organisation Corp.
            </p>
            <p>
              I've attached a proposal detailing how we envision our
              collaboration, including key benefits, timelines, and
              implementation strategies. I believe this partnership could unlock
              exciting opportunities for both of us!
            </p>
            <p>
              Let me know your thoughts or a convenient time to discuss this
              further. I'm happy to schedule a call or meeting at your earliest
              convenience.
            </p>
            <p>Looking forward to hearing from you!</p>
            <p>
              Best regards,
              <br />
              Jane
            </p>

            {/* Repeated content to show scrolling */}
            <p>
              I hope this message finds you well! I'm reaching out to explore a
              potential partnership between our companies. At Jane Corp, which
              could complement your offerings at John Organisation Corp.
            </p>
            <p>
              I've attached a proposal detailing how we envision our
              collaboration, including key benefits, timelines, and
              implementation strategies. I believe this partnership could unlock
              exciting opportunities for both of us!
            </p>
            <p>
              Let me know your thoughts or a convenient time to discuss this
              further. I'm happy to schedule a call or meeting at your earliest
              convenience.
            </p>
            <p>Looking forward to hearing from you!</p>
            <p>
              Best regards,
              <br />
              Jane
            </p>
            <p>
              I hope this message finds you well! I'm reaching out to explore a
              potential partnership between our companies. At Jane Corp, which
              could complement your offerings at John Organisation Corp.
            </p>
            <p>
              I've attached a proposal detailing how we envision our
              collaboration, including key benefits, timelines, and
              implementation strategies. I believe this partnership could unlock
              exciting opportunities for both of us!
            </p>
            <p>
              Let me know your thoughts or a convenient time to discuss this
              further. I'm happy to schedule a call or meeting at your earliest
              convenience.
            </p>
            <p>Looking forward to hearing from you!</p>
            <p>
              Best regards,
              <br />
              Jane
            </p>

            {/* Additional content to ensure scrolling */}
            <p>
              I hope this message finds you well! I'm reaching out to explore a
              potential partnership between our companies. At Jane Corp, which
              could complement your offerings at John Organisation Corp.
            </p>
            <p>
              I've attached a proposal detailing how we envision our
              collaboration, including key benefits, timelines, and
              implementation strategies. I believe this partnership could unlock
              exciting opportunities for both of us!
            </p>
            <p>
              Let me know your thoughts or a convenient time to discuss this
              further. I'm happy to schedule a call or meeting at your earliest
              convenience.
            </p>
            <p>Looking forward to hearing from you!</p>
            <p>
              Best regards,
              <br />
              Jane
            </p>

            <p>
              I hope this message finds you well! I'm reaching out to explore a
              potential partnership between our companies. At Jane Corp, which
              could complement your offerings at John Organisation Corp.
            </p>
            <p>
              I've attached a proposal detailing how we envision our
              collaboration, including key benefits, timelines, and
              implementation strategies. I believe this partnership could unlock
              exciting opportunities for both of us!
            </p>
            <p>
              Let me know your thoughts or a convenient time to discuss this
              further. I'm happy to schedule a call or meeting at your earliest
              convenience.
            </p>
            <p>Looking forward to hearing from you!</p>
            <p>
              Best regards,
              <br />
              Jane
            </p>

            <p>
              I hope this message finds you well! I'm reaching out to explore a
              potential partnership between our companies. At Jane Corp, which
              could complement your offerings at John Organisation Corp.
            </p>
            <p>
              I've attached a proposal detailing how we envision our
              collaboration, including key benefits, timelines, and
              implementation strategies. I believe this partnership could unlock
              exciting opportunities for both of us!
            </p>
            <p>
              Let me know your thoughts or a convenient time to discuss this
              further. I'm happy to schedule a call or meeting at your earliest
              convenience.
            </p>
            <p>Looking forward to hearing from you!</p>
            <p>
              Best regards,
              <br />
              Jane
            </p>

            <p>
              I hope this message finds you well! I'm reaching out to explore a
              potential partnership between our companies. At Jane Corp, which
              could complement your offerings at John Organisation Corp.
            </p>
            <p>
              I've attached a proposal detailing how we envision our
              collaboration, including key benefits, timelines, and
              implementation strategies. I believe this partnership could unlock
              exciting opportunities for both of us!
            </p>
            <p>
              Let me know your thoughts or a convenient time to discuss this
              further. I'm happy to schedule a call or meeting at your earliest
              convenience.
            </p>
            <p>Looking forward to hearing from you!</p>
            <p>
              Best regards,
              <br />
              Jane
            </p>

            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600">
                <Download className="h-5 w-5" />
                <span className="font-medium">Proposal-Partnership.pdf</span>
                <span className="text-sm text-gray-500">1.5 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Green Footer Section */}
      <div className="flex-shrink-0 bg-lime-400">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Reply Box with Reply Button
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 max-w-md">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={3}
                placeholder="Type your reply here..."
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Send className="h-5 w-5" />
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EC;
