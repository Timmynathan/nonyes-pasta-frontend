export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold mb-6">About Nonye's Pasta</h1>
      <div className="space-y-5 text-brand-dark/80 leading-relaxed">
        <p>
          Nonye's Pasta was born from a passion for bold flavors and a love of great food. Based in
          Lagos, Nigeria, we craft every dish fresh to order — no shortcuts, no shortcuts on love.
        </p>
        <p>
          Our menu blends classic Italian pasta techniques with rich Nigerian flavors, creating unique
          dishes like our Suya & Veggie Jollof Spag and Native Pasta that you simply won't find
          anywhere else. From creamy Shrimp Alfredo Fettuccine to hearty Beef Lasagna, every dish
          tells a story.
        </p>
        <p className="font-semibold text-brand-red text-xl italic">Love at first bite.</p>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { icon: '🍝', title: 'Specialization', desc: 'Each recipe is crafted with expert technique and bold Nigerian soul.' },
            { icon: '✨', title: 'Variety', desc: '12 unique dishes — pasta, lasagna, and signature mocktails.' },
            { icon: '📦', title: 'Fresh to Order', desc: 'Every meal is made fresh when you place your pre-order.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-brand-dark/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
