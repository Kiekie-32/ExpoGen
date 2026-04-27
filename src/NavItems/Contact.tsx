export default function Contact() {
  return (
    <div className="px-8 md:px-16 py-20">
      <h1 className="text-4xl font-light mb-6">Contact</h1>
      <p className="text-white/60 mb-4">
        Have questions or need support? Reach out to us.
      </p>

      <form className="max-w-md flex flex-col gap-4">
        <input
          type="text"
          placeholder="Your Name"
          className="bg-white/10 border border-white/20 px-4 py-2 rounded text-white"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="bg-white/10 border border-white/20 px-4 py-2 rounded text-white"
        />
        <textarea
          placeholder="Your Message"
          className="bg-white/10 border border-white/20 px-4 py-2 rounded text-white"
        />
        <button className="bg-white text-black py-2 rounded hover:bg-white/80 transition">
          Send Message
        </button>
      </form>
    </div>
  );
}
