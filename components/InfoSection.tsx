
import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <section className="bg-zinc-900 py-16 text-gray-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Private Karaoke in Soho | London Karaoke Club</h2>
        
        <div className="space-y-8 leading-relaxed">
          <p>
            Welcome to London Karaoke Club, Soho’s premier destination for private karaoke, open daily from 2pm to 3am. 
            Steps from Oxford Street, Bond Street, Tottenham Court Road, and minutes from London Bridge, Victoria, Marylebone, 
            and the West End, we’re at the heart of London’s nightlife.
          </p>
          <p>
            Say goodbye to chain karaoke’s claustrophobic, padded boxes. Our entire private spaces with dedicated private 
            entrances host groups of 10 to 50+ for hen dos, birthdays, weddings, or corporate events, delivering 60,000+ 
            songs through studio-quality sound equipment. Advance prebooking is essential—no walk-ins allowed. 
            Prebook your private karaoke night and sing until 3am in Soho’s open, electric spaces!
          </p>

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">No Boxes, Just Epic Sound</h3>
            <p>
              We’re not a franchise. No imprisoned, padded rooms or lifeless playlists. Our entire private spaces are your 
              personal club: velvet drapes, fairy lights, open layouts, and studio-quality sound equipment that delivers 
              crystal-clear audio, outshining most London venues. With 60,000+ songs, guests use the Remote Controller 
              to browse via smartphones and add tracks to the Queue. Customize with Custom Key & Tempo, tweak Customizable 
              Vocals for lead or backup, and enjoy 400+ new songs monthly via Daily Updates. Explore our song catalogue 
              for 10 to 50+ guests in a vibrant, unconfined space, secured by prebooking.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Soho’s Premier Locations</h3>
            <p>
              Our venues are Soho’s pulse, surrounded by Mayfair, Marylebone, and the West End. Hidden in plain sight, 
              our spaces open into electric, open areas with private entrances, perfect for groups of 10 to 50+. Open 2pm 
              to 3am daily, we outlast competitors, hosting late-night cast parties, tour wrap-ups, or work celebrations. 
              Prebook in advance—no walk-ins ensures your exclusive space. Our 5-star service delivers better value than 
              pricy chains, and if you’re lost, we’ll guide you to your private entrance.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Gourmet Treats, Vibrant Nights</h3>
            <p>
              Indulge in delicious sharing platters, gourmet snacks, and reasonably priced cocktails, crafted for groups 
              of 10 to 50+ at hen parties, birthdays, or corporate events. Our menu, paired with studio-quality sound in 
              open spaces, elevates your late-night karaoke until 3am. See our event packages to plan a prebooked night 
              that surpasses Soho’s boxed venues.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Prebook Your Exclusive Space</h3>
            <p className="mb-4">
              Advance prebooking is required—no walk-ins allowed, ensuring your group of 10 to 50+ enjoys an exclusive, 
              open space with a private entrance Soho venues. Use our instant online booking or WhatsApp for tailored planning. 
              Open 2pm to 3am daily, we deliver flawless execution. Missing a song? Contact us to add it!
            </p>
            <p className="font-bold text-yellow-400">
              Prebook Now | Plan via WhatsApp. No chains, no boxes—just your private, spectacular night in Soho.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
