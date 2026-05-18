import { Link } from "react-router-dom";

export const Page500 = () => {
    return (
        <main>
            <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat">
                <div className="max-w-md mx-auto text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                    <div className="text-9xl font-bold text-indigo-600 mb-4">500</div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">Internal Server Error</h1>
                    <p className="text-lg text-gray-600 mb-8">We apologize for the inconvenience. Please try again later..</p>
                    <Link to="/Home"
                        className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                        Go Back Home
                    </Link>
                </div>
            </div></main>
    );
};
