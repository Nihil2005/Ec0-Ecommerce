import React, { useState } from "react";

const FAQPage = () => {
  const faqs = [
    {
      question: "What is Ecomart ?",
      answer:
        "Eco-Mart is an decentralized sustainability marketplace  dedicated to promoting sustainable living through its wide range of eco-friendly products. Their mission is to provide high-quality, ethically sourced items that align with customers' environmental values. From reusable household items to fair trade fashion and zero-waste essentials, Eco-Mart offers a diverse selection to meet various sustainability needs.",
    },
    {
      question: "What are the  features of Ecomart ?",
      answer:
        "Ecomart is a groundbreaking decentralized marketplace dedicated to sustainability, offering a diverse range of eco-friendly products and fostering a community committed to ethical consumption and responsible commerce. At the core of Ecomart is a robust verification system that ensures sellers meet stringent sustainability standards, providing buyers with confidence in the authenticity and environmental integrity of their purchases. Leveraging blockchain technology, Ecomart ensures transparent and immutable transaction records, enabling users to trace the lifecycle of products and verify their sustainability credentials. Smart contracts automate and enforce agreements between buyers and sellers, streamlining transactions and reducing reliance on intermediaries. Beyond transactions, Ecomart serves as a hub for community engagement, offering forums and social features for users to share knowledge, exchange ideas, and collaborate on sustainability initiatives. With tools for tracking and offsetting carbon footprints, comprehensive educational resources, and a commitment to user privacy and data security, Ecomart empowers individuals and businesses to make informed, sustainable choices and contribute to a more equitable and environmentally conscious future.",
    },
    {
      question: "How to contact Ecomart Support ?", 
      answer:
        " Send an email to the support team at their designated support email address. This information is usually available on the Ecomart website or within the platform itself. Be sure to provide as much detail as possible about your issue or inquiry when composing your email.. To support@ecomart.com",
    },
   
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <div className="container mx-auto px-4 mt-6 p-7 text-white py-8">
      <h1 className="text-3xl font-bold mb-4">FAQs</h1>
      <div className="divide-y divide-gray-300">
        {faqs.map((faq, index) => (
          <div key={index} className="py-4">
            <button
              onClick={() => toggleFAQ(index)}
              className="text-left w-full focus:outline-none"
            >
              <h2 className="text-xl font-semibold">{faq.question}</h2>
            </button>
            {expandedIndex === index && (
              <p className="mt-2">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
