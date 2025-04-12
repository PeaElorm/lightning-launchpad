import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Welcome to <span className="text-lightning-primary">Lightning Launchpad</span>
        </h1>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Your interactive guide to understanding and using the Lightning Network
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">
                <span className="text-2xl mr-2">🎓</span> Learn Lightning Network
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  Understand how Lightning channels work, how payments are routed, and why it's revolutionizing Bitcoin.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  to="/visual-explainer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-950 hover:bg-blue-800"
                >
                  Explore the Visual Guide
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">
                <span className="text-2xl mr-2">🚀</span> Get Started with Lightning
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  Set up your first Lightning wallet, learn about funding, and get recommendations for your first channels.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  to="/setup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white  bg-blue-950 hover:bg-blue-800"
                >
                  Setup Wizard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Why Lightning Network Matters</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium">⚡ Speed</h4>
                <p className="mt-2 text-sm text-gray-500">Instant payments with no need to wait for blockchain confirmations</p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium">💸 Low Fees</h4>
                <p className="mt-2 text-sm text-gray-500">Transactions cost fractions of a cent, enabling micro-payments</p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium">🔐 Privacy</h4>
                <p className="mt-2 text-sm text-gray-500">Improved privacy as channel transactions aren't recorded on-chain</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;