import { Download, Send, Archive, OctagonAlert, Trash2 } from "lucide-react";

function EC({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 mb-4">
        <div
          className={`flex items-center justify-between border-b pb-2 ${
            isDarkMode
              ? "border-gray-800 text-gray-50"
              : "border-gray-200 text-gray-800"
          }`}
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold line-clamp-1">
              Hello, this is me Anish Gupta,
            </h3>
          </div>
        </div>

        <div
          className={`flex items-center justify-between mt-3 pb-2 border-b ${
            isDarkMode
              ? "text-gray-50 border-gray-800"
              : "text-gray-800 border-gray-200"
          }`}
        >
          <div className="flex-1 font-semibold">
            <div className="flex items-center gap-2">
              <img
                src="https://images.pexels.com/photos/32392457/pexels-photo-32392457.jpeg"
                alt="Profile"
                className={`w-12 h-12 rounded-full border-2 ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              />
              <div>
                <p>Anish Gupta | {"<nativeanish@gmail.com>"}</p>
                <p className="text-sm text-gray-500">10th July</p>
              </div>
            </div>
          </div>
          <div
            className={`flex items-center justify-end gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-800"
            }`}
          >
            <button
              className="p-2 hover:bg-pink-400 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              className="p-2 hover:bg-pink-400 rounded-lg transition-colors"
              title="Archive"
            >
              <Archive className="h-5 w-5" />
            </button>
            <button
              className="p-2 hover:bg-pink-400 rounded-lg transition-colors"
              title="Spam"
            >
              <OctagonAlert className="h-5 w-5" />
            </button>
            <button
              className="p-2 hover:bg-pink-400 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* THIS IS THE SCROLLABLE CONTENT AREA */}
      <div className="flex-1 bg-white overflow-y-auto p-6 border border-gray-300 rounded-lg min-h-0">
        <div className="space-y-6">
          <div className="text-center py-8 bg-blue-50 rounded-lg">
            <h2 className="text-2xl font-medium text-gray-800 mb-4">
              📧 Email Content Area - ONLY THIS SCROLLS!
            </h2>
            <p className="text-gray-600">
              Scroll down to see more content. The main page won't scroll.
            </p>
          </div>

          {/* Long content to demonstrate scrolling */}
          <div className="space-y-6 text-gray-700">
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <p className="font-semibold">
                📍 You are now in the scrollable content area!
              </p>
              <p>This area will scroll independently from the main page.</p>
            </div>

            <p className="text-lg">Hi John,</p>
            <p>
              I hope this message finds you well! I'm reaching out to explore a
              potential partnership between our companies. At Jane Corp, we've
              developed innovative solutions that could complement your
              offerings at John Organisation Corp.
            </p>
            <p>
              I've attached a comprehensive proposal detailing how we envision
              our collaboration, including key benefits, detailed timelines, and
              implementation strategies. I believe this partnership could unlock
              exciting opportunities for both of us!
            </p>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎯 Project Highlights
              </h3>
              <ul className="space-y-2 text-green-700">
                <li>• 40% increase in operational efficiency</li>
                <li>• 60% reduction in manual processing time</li>
                <li>• Improved customer satisfaction scores</li>
                <li>• Scalable architecture for future growth</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              📋 Detailed Project Timeline
            </h3>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-blue-800">
                  Phase 1 (Weeks 1-2): Discovery & Requirements
                </p>
                <p className="text-blue-700">
                  Initial discovery and requirements gathering. During this
                  phase, we'll conduct stakeholder interviews, analyze current
                  processes, and document comprehensive requirements.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold text-purple-800">
                  Phase 2 (Weeks 3-4): Design & Architecture
                </p>
                <p className="text-purple-700">
                  Design and architecture planning. We'll create detailed
                  wireframes, system architecture diagrams, and comprehensive
                  technical specifications for the entire project.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="font-semibold text-orange-800">
                  Phase 3 (Weeks 5-8): Development & Implementation
                </p>
                <p className="text-orange-700">
                  This is where the core development work happens, including
                  frontend and backend implementation, API development, and
                  database design.
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-800">
                  Phase 4 (Weeks 9-10): Testing & Deployment
                </p>
                <p className="text-red-700">
                  Comprehensive testing, quality assurance, and deployment
                  preparation. We'll conduct thorough testing and prepare for
                  production deployment.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              💻 Technical Requirements
            </h3>
            <p>
              The system will be built using modern web technologies including
              React, Node.js, and PostgreSQL. We'll implement responsive design
              principles to ensure compatibility across all devices and screen
              sizes.
            </p>
            <p>
              Security will be a top priority, with implementation of OAuth 2.0
              authentication, data encryption at rest and in transit, regular
              security audits, and compliance with industry standards.
            </p>
            <p>
              Performance optimization will include CDN implementation, database
              indexing, advanced caching strategies, and code splitting for
              optimal load times and user experience.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                💰 Budget Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border">
                  <p className="font-semibold">Development: $45,000</p>
                  <p className="text-sm text-gray-600">
                    Frontend and backend development
                  </p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <p className="font-semibold">Design: $8,000</p>
                  <p className="text-sm text-gray-600">
                    UI/UX design and design system
                  </p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <p className="font-semibold">Testing & QA: $5,000</p>
                  <p className="text-sm text-gray-600">
                    Comprehensive testing suite
                  </p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <p className="font-semibold">Project Management: $7,000</p>
                  <p className="text-sm text-gray-600">
                    Agile project management
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              🎯 Expected Outcomes
            </h3>
            <p>
              Upon completion, you can expect significant improvements in
              operational efficiency, reduced manual processing time, and
              improved customer satisfaction scores across all metrics.
            </p>
            <p>
              The system will be fully scalable to handle future growth, with
              built-in analytics to track performance metrics, user engagement,
              and business KPIs.
            </p>
            <p>
              We'll provide comprehensive documentation, detailed training
              materials, and ongoing support for the first 6 months post-launch
              to ensure smooth operation.
            </p>

            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
              <h3 className="text-xl font-semibold text-red-800 mb-4">
                ⚠️ Risk Mitigation
              </h3>
              <p className="text-red-700">
                We've identified potential risks and have comprehensive
                mitigation strategies in place. These include regular backup
                procedures, staged deployment processes, and rollback
                capabilities.
              </p>
              <p className="text-red-700 mt-2">
                Our experienced team has successfully completed similar projects
                and will apply best practices learned from previous
                implementations.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              🚀 Next Steps
            </h3>
            <p>
              If you're interested in moving forward, we can schedule a detailed
              presentation to walk through the proposal and answer any questions
              you may have.
            </p>
            <p>
              We're excited about the possibility of working together and
              believe this partnership will be mutually beneficial for both our
              organizations.
            </p>

            <div className="bg-green-50 p-6 rounded-lg text-center">
              <p className="text-lg font-semibold text-green-800">
                🎉 End of Email Content
              </p>
              <p className="text-green-700">
                You've reached the bottom! Notice how only this area scrolled?
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600">
                  <Download className="h-5 w-5" />
                  <span className="font-medium">
                    Detailed-Proposal-Partnership.pdf
                  </span>
                  <span className="text-sm text-gray-500">2.8 MB</span>
                </div>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600">
                  <Download className="h-5 w-5" />
                  <span className="font-medium">
                    Technical-Architecture-Diagram.pdf
                  </span>
                  <span className="text-sm text-gray-500">1.2 MB</span>
                </div>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600">
                  <Download className="h-5 w-5" />
                  <span className="font-medium">
                    Budget-Breakdown-Spreadsheet.xlsx
                  </span>
                  <span className="text-sm text-gray-500">856 KB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer Section */}
      <div className="flex-shrink-0 pt-4">
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Send className="h-5 w-5" />
            Reply
          </button>
          <button className="bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors">
            Reply All
          </button>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
            Forward
          </button>
        </div>
      </div>
    </div>
  );
}

export default EC;
