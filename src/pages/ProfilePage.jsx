import React, { useState, useEffect } from "react";

const ProfilePage = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [collaboratorsInvited, setCollaboratorsInvited] = useState(false);
  const [productUpdates, setProductUpdates] = useState(false);
  const [campaignNotifications, setCampaignNotifications] = useState(false);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    // Total fields considered for completion
    let completedFields = 0;
    if (email.trim()) completedFields++;
    if (phone.trim()) completedFields++;
    if (linkedinConnected) completedFields++;
    if (twitterConnected) completedFields++;
    if (collaboratorsInvited) completedFields++;

    const totalFields = 5;
    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletion(percentage);
  }, [email, phone, linkedinConnected, twitterConnected, collaboratorsInvited]);

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <img
          src="https://i.pravatar.cc/100"
          alt="User"
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>

      {/* Profile Snapshot */}
      <div className="flex flex-col md:flex-row justify-between gap-6 items-center mb-10">
        <div className="flex-1">
          <p className="text-sm text-gray-600">Profile Snapshot</p>
          <h2 className="text-md font-semibold">Profile Completion</h2>
          <p className="text-sm text-gray-500 mt-1">
            Complete your profile to unlock more features and increase your visibility.
          </p>

          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-black h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
          <p className="text-right text-sm mt-1 text-gray-700">{completion}%</p>
        </div>

        <img
          src="https://i.imgur.com/06RUD2N.png"
          alt="Profile"
          className="w-40 h-40 rounded-xl object-cover"
        />
      </div>

      {/* Contact Information */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full max-w-md px-4 py-2 mb-3 border border-gray-300 rounded-md"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Connected Accounts */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">Connected Accounts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between max-w-md">
            <span>LinkedIn</span>
            <button
              onClick={() => setLinkedinConnected(!linkedinConnected)}
              className={`px-4 py-1 rounded-md border ${
                linkedinConnected ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              {linkedinConnected ? "Connected" : "Connect"}
            </button>
          </div>
          <div className="flex items-center justify-between max-w-md">
            <span>Twitter</span>
            <button
              onClick={() => setTwitterConnected(!twitterConnected)}
              className={`px-4 py-1 rounded-md border ${
                twitterConnected ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              {twitterConnected ? "Connected" : "Connect"}
            </button>
          </div>
        </div>
      </div>

      {/* Collaborators */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">Collaborators</h3>
        <div className="flex items-center justify-between max-w-md">
          <span>Invite Collaborators</span>
          <button
            onClick={() => setCollaboratorsInvited(!collaboratorsInvited)}
            className="px-4 py-1 rounded-md border hover:bg-gray-100"
          >
            {collaboratorsInvited ? "Invited" : "Invite"}
          </button>
        </div>
      </div>

      {/* Email Preferences */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">Email Preferences</h3>
        <div className="space-y-3 max-w-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Product Updates</p>
              <p className="text-sm text-gray-500">
                Receive notifications about new features and updates.
              </p>
            </div>
            <input
              type="checkbox"
              checked={productUpdates}
              onChange={() => setProductUpdates(!productUpdates)}
              className="toggle toggle-sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Campaign Notifications</p>
              <p className="text-sm text-gray-500">
                Receive notifications about campaigns and performance reports.
              </p>
            </div>
            <input
              type="checkbox"
              checked={campaignNotifications}
              onChange={() => setCampaignNotifications(!campaignNotifications)}
              className="toggle toggle-sm"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <strong>Campaign Sent</strong>: "Marketing Outreach" sent to 50 contacts.
            <span className="block text-gray-400">2 days ago</span>
          </li>
          <li>
            <strong>Template Updated</strong>: Follow-up Email updated.
            <span className="block text-gray-400">1 week ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
