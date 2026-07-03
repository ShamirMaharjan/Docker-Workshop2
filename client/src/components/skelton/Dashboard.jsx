import Navbar from "../Navbar";

export default function DashboardSkelton() {
    return (
            <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
                <Navbar />
                <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="space-y-3 w-full md:w-auto">
                            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse hidden sm:block"></div>
                        </div>
                        <div className="flex w-full md:w-auto gap-3">
                            <div className="h-11 w-full sm:w-64 bg-gray-200 rounded-xl animate-pulse"></div>
                            <div className="h-11 w-32 bg-gray-200 rounded-xl animate-pulse hidden sm:block"></div>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 overflow-hidden md:grid md:grid-cols-3 md:gap-6">
                        {[1, 2, 3].map(col => (
                            <div key={col} className="w-[85vw] sm:w-[350px] md:w-auto shrink-0 bg-gray-200 p-4 rounded-2xl border border-gray-200/60 h-[60vh]">
                                <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse mb-6"></div>
                                {[1, 2, 3].map(card => (
                                    <div key={card} className="bg-white h-32 rounded-xl border border-gray-100 mb-4 animate-pulse"></div>
                                ))}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
}