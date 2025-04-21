
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="mb-6 text-gray-700">
            At Repair Auto Pilot, we are dedicated to streamlining appliance repair businesses by providing powerful, easy-to-use workflow and diagnostic tools. Our platform is built by repair professionals, for repair professionals—with the goal of saving time, reducing errors, and powering business growth.
          </p>
          <h2 className="text-2xl font-semibold mb-2 mt-6">Why Choose Us?</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Industry-leading diagnostic workflows</li>
            <li>Modern, mobile-friendly experience</li>
            <li>Backed by a passionate, skilled support team</li>
            <li>Continuous innovation based on real user feedback</li>
          </ul>
          <p className="text-gray-700">Founded in 2022 • Headquartered in the United States</p>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
