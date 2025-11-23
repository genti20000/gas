
import React from 'react';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => (
    <details className="group bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4 transition-colors hover:border-zinc-700 open:border-yellow-400/50">
        <summary className="flex justify-between items-center font-bold text-lg text-white cursor-pointer list-none focus:outline-none">
            <span>{question}</span>
            <span className="transform group-open:rotate-180 transition-transform duration-300 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </span>
        </summary>
        <div className="mt-4 text-gray-300 text-sm leading-relaxed animate-fade-in-up">
            {answer}
        </div>
    </details>
);

const FAQ: React.FC = () => {
    const faqData = [
        {
            question: "What are the opening hours?",
            answer: "You can check this via our booking system online."
        },
        {
            question: "Do I need to book in advance?",
            answer: "Yes, pre-booking is mandatory. You can check availability and book through our online booking system available on our website."
        },
        {
            question: "What is the cost of booking a karaoke room?",
            answer: "Prices vary depending on the group size and booking duration. The minimum booking is 2 hours. Check our booking system for real-time pricing and to book for up to 50 guests."
        },
        {
            question: "Is food and drink included in the booking price?",
            answer: "No, but we have a full menu available to purchase throughout your stay."
        },
        {
            question: "Can I bring my own food and drinks?",
            answer: "Outside food and drinks are not permitted. We’ve got everything you need right here."
        },
        {
            question: "Is there an age limit to enter the club?",
            answer: "Yes, we’re an 18+ venue. Adults only, baby."
        },
        {
            question: "Do you have a dress code?",
            answer: "Come as you are or glam it up — costumes, masks, sequins... we love it all. Just be fabulous."
        },
        {
            question: "How many songs are available, and in which languages?",
            answer: "We have over 65,000 songs in English and many other languages. There's something for everyone."
        },
        {
            question: "Can I extend my booking time on the spot?",
            answer: "Yes, subject to availability. Let us know early during your visit to avoid disappointment."
        },
        {
            question: "How can I contact the club for more information?",
            answer: "You can message us anytime via WhatsApp. We’re here to help!"
        }
    ];

  return (
    <section className="bg-black py-16 border-t border-zinc-800">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-2">
            {faqData.map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
