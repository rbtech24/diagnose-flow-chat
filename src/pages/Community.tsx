
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Community() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Connect with Other Pros</h2>
          <p className="mb-6 text-gray-700">
            The Repair Auto Pilot Community is where appliance repair professionals share knowledge, workflow tips, and industry insights.
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Ask questions and get real answers from peers and support staff</li>
            <li>Show off successful fixes and workflow tricks</li>
            <li>Stay up to date on new features and best practices</li>
            <li>Suggest improvements to the platform</li>
          </ul>
          <p className="mt-8 text-gray-500 text-sm text-center">Community posts and discussions coming soon.</p>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
