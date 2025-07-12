import React, { useState, useEffect } from "react";

const Profile = () => {
  const [email, setEmail] = useState("sophia.carter@gmail.com");
  const [fullName, setFullName] = useState("Sophia Carter");
  const [phone, setPhone] = useState("+1 (555) 123–4567");
  const [tagline, setTagline] = useState("Aspiring Product Manager | Email Outreach Pro");
  const [connectedGoogle, setConnectedGoogle] = useState(true);
  const [connectedOutlook, setConnectedOutlook] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    let completedFields = 0;
    if (email) completedFields++;
    if (fullName) completedFields++;
    if (phone) completedFields++;
    if (tagline) completedFields++;
    if (connectedGoogle || connectedOutlook) completedFields++;

    const total = 5;
    setCompletion(Math.round((completedFields / total) * 100));
  }, [email, fullName, phone, tagline, connectedGoogle, connectedOutlook]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
        {/* Profile image and preview */}
        <div className="flex items-start gap-4">
          <img
            src="https://i.imgur.com/yYXIZzv.png"
            alt="abstract"
            className="w-40 h-32 object-cover rounded-xl"
          />
          <div>
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="text-sm text-gray-500 mt-1">
              Profile Completeness: <strong>{completion}%</strong><br />
              Complete your profile to unlock more features and increase your visibility.
            </p>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Edit Profile
        </button>
      </div>

      {/* Personal Info */}
      <div className="border-t pt-6">
        <h2 className="text-md font-semibold mb-3">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium">Full Name</p>
            <p>{fullName}</p>
          </div>
          <div>
            <p className="font-medium">Email Address</p>
            <p>{email}</p>
          </div>
          <div>
            <p className="font-medium">Phone Number</p>
            <p>{phone}</p>
          </div>
          <div>
            <p className="font-medium">Tagline</p>
            <p>{tagline}</p>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="mt-10">
        <h2 className="text-md font-semibold mb-3">Connected Accounts</h2>
        <div className="flex flex-wrap gap-4">
          <button
            className={`flex items-center gap-2 border rounded-md px-4 py-2 ${
              connectedGoogle ? "bg-gray-100" : ""
            }`}
            onClick={() => setConnectedGoogle(!connectedGoogle)}
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" className="w-5 h-5" />
            Google
          </button>
          <button
            className={`flex items-center gap-2 border rounded-md px-4 py-2 ${
              connectedOutlook ? "bg-gray-100" : ""
            }`}
            onClick={() => setConnectedOutlook(!connectedOutlook)}
          >
            <img src="https://img.icons8.com/fluency/48/outlook.png" className="w-5 h-5" />
            Outlook
          </button>
        </div>
      </div>

      {/* Membership Status */}
      <div className="mt-10">
        <h2 className="text-md font-semibold mb-3">Membership Status</h2>
        <div className="flex items-center gap-2 text-sm">
          <p>Premium Member</p>
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        </div>
      </div>

      {/* Preferences */}
      <div className="mt-10">
        <h2 className="text-md font-semibold mb-3">Preferences</h2>
        <div className="space-y-4">
          <Toggle label="Email Notifications" enabled={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} />
          <Toggle label="SMS Notifications" enabled={smsNotifs} onToggle={() => setSmsNotifs(!smsNotifs)} />
          <Toggle label="Push Notifications" enabled={pushNotifs} onToggle={() => setPushNotifs(!pushNotifs)} />
        </div>
      </div>
    </div>
  );
};

// Toggle component
const Toggle = ({ label, enabled, onToggle }) => (
  <div className="flex items-center justify-between max-w-sm">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      onClick={onToggle}
      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        enabled ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          enabled ? "translate-x-5" : ""
        }`}
      ></div>
    </button>
  </div>
);

export default Profile;
