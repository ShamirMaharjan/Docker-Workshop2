import Navbar from "../Navbar";

export default function ProfileSkelton() {
    return (
            <div className="min-h-screen bg-gray-50 font-sans">
                <Navbar />
                <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse shrink-0"></div>
                        <div className="space-y-2">
                            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse hidden sm:block"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 h-[300px] bg-gray-200 border border-gray-200/60 rounded-3xl animate-pulse"></div>
                        <div className="md:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 border border-gray-200/60 rounded-3xl animate-pulse"></div>)}
                            </div>
                            <div className="h-64 bg-gray-200 border border-gray-200/60 rounded-3xl animate-pulse"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
}