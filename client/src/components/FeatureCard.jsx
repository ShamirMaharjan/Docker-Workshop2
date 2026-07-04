export default function FeatureCard({ icon: Icon, title, text }) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Icon size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 leading-relaxed font-medium">{text}</p>
        </div>
    )
}