
const ThankYou = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-lg font-medium">Traveller</span>
            <div className="w-px h-6 bg-gray-300"></div>
            <span className="text-lg font-medium">district</span>
          </div>
          
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 border-4 border-black rounded-full mb-4">
              <span className="text-3xl font-bold">T</span>
              <div className="w-8 h-8 border-2 border-black rounded-full ml-1"></div>
              <span className="text-3xl font-bold">P</span>
            </div>
            <div className="text-sm font-medium">
              <div>RESTAURANT</div>
              <div>AWARDS 2025</div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden">
            <h1 className="text-2xl font-bold mb-4">Thank you for voting</h1>
            <p className="text-base text-gray-700 mb-6">
              Your votes are confidential and secure and will crown India's top 50 restaurants of the year. You can now close this window
            </p>
            <button className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800">
              Close
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block space-y-6">
            <h1 className="text-4xl font-bold text-green-600">Thank You!</h1>
            <p className="text-xl text-gray-700">
              Your votes have been successfully submitted.
            </p>
            <p className="text-lg text-gray-600">
              Thank you for participating in India's Top Restaurant Awards 2025.<br />
              Your expert opinion will help crown the country's finest dining establishments.
            </p>
            <p className="text-base text-gray-500">
              Results will be announced soon. Stay tuned!
            </p>
          </div>

          <div className="mt-12 text-center text-sm text-gray-600">
            © 2025 Traveller & District - Top Restaurant Awards
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black text-white text-center py-3">
        <p className="text-sm">© 2025 Condé Nast</p>
      </footer>
    </div>
  );
};

export default ThankYou;
