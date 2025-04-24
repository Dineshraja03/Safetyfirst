import React, { useState } from 'react';
import { 
  FaGavel, 
  FaExclamationTriangle, 
  FaBook, 
  FaPhone, 
  FaShieldAlt, 
  FaUserSecret, 
  FaHeartBroken 
} from 'react-icons/fa';
import Navbar from '../components/Home/Navbar';
import Modal from '../components/Modal/InfoModal';
import './LegalRightsPage.css';
import Chatbot from '../Chatbot/Chatbot';
import EmergencyButton from '../EmergencyButton';


// Content for each option's modal
const modalContent = {
  harassment: {
    title: "What is Harassment",
    summary: "Harassment covers a wide range of behaviors that are offensive, threatening, or disturbing. It can occur in various settings including schools, workplaces, online platforms, and public spaces. Understanding what constitutes harassment is crucial for protection.",
    details: "Harassment is legally defined as conduct that is severe, pervasive, and objectively offensive. It includes physical actions, verbal abuse, written communication, or graphical representation directed at a specific person that causes them distress. Types include sexual harassment, cyberbullying, stalking, and discriminatory harassment based on protected characteristics like gender, race, or religion. In many countries, harassment is prohibited by law, with specific provisions protecting minors and vulnerable populations.",
    articles: [
      { title: "Sexual Harassment | RAINN", url: "https://www.rainn.org/articles/sexual-harassment" },
      { title: "Street Harassment | RAINN", url: "https://rainn.org/articles/street-harassment" },
      { title: "Empower Managers to Stop Harassment | Harvard Business Review", url: "https://hbr.org/2020/05/empower-managers-to-stop-harassment" },
      // { title: "Steps to Take When Being Harassed", url: "#" }
    ],
    videos: [
      { id: "0T3EMaKpGSQ", title: "Understanding Different Types of Harassment" },
      { id: "jNhmmTr88_8", title: "How to Respond to Harassment - Expert Advice" }
    ]
  },
  sexEd: {
    title: "Sex Education Essentials",
    summary: "Comprehensive sex education provides age-appropriate, scientifically accurate information about human development, relationships, personal skills, and sexual health. It helps young people make informed, responsible decisions about their bodies and relationships.",
    details: "Proper sex education encompasses more than just biology - it includes discussions about consent, boundaries, healthy relationships, and emotional well-being. Studies show that comprehensive sex education reduces rates of unintended pregnancy and sexually transmitted infections while empowering young people to recognize inappropriate behavior. Age-appropriate education starts with teaching children about body autonomy and privacy, developing into more detailed information as they mature.",
    articles: [
      { title: "What is Sex Education? | Planned Parenthood", url: "https://www.plannedparenthood.org/learn/for-educators/what-sex-education" },
      { title: "Comprehensive Sexuality Education | WHO", url: "https://www.who.int/news-room/questions-and-answers/item/comprehensive-sexuality-education" },
      { title: "Sex Ed Isn't Actually About Sex | Harvard Medical School", url: "https://info.primarycare.hms.harvard.edu/perspectives/articles/sex-ed-isnt-about-sex" },
      { title: "The Importance of Access to Comprehensive Sex Education | AAP", url: "https://www.aap.org/en/patient-care/adolescent-sexual-health/equitable-access-to-sexual-and-reproductive-health-care-for-all-youth/the-importance-of-access-to-comprehensive-sex-education/" }
    ],
    videos: [
      { id: "evxxfFAGAoY", title: "Age-Appropriate Sex Education for Children" },
      { id: "_gJ5V525SCk", title: "Understanding Consent and Boundaries" }
    ]
  },
  emergencyNumbers: {
    title: "Emergency Numbers",
    summary: "Having immediate access to emergency contact numbers can be life-saving in critical situations. These include national emergency services, specialized helplines for children and women, and resources for reporting abuse or harassment.",
    details: "Emergency response systems vary by country, but most have dedicated numbers for police, medical emergencies, and fire services. Beyond these general services, specialized helplines exist for specific situations such as domestic violence, child abuse, mental health crises, and sexual assault. Many modern helplines offer multiple contact methods including calls, texts, and online chats to ensure accessibility for all individuals in need of urgent assistance.",
    articles: [
      { title: "Mental Health Helpline (Kiran): 9152987821", url: "tel:9152987821" },
      { title: "Women Helpline: 1091​", url: "tel:1091" },
      { title: "Childline: 1098", url: "tel:1098" },
      { title: "Cybercrime Helpline: 155260", url: "tel:155260" }
    ],
    videos: [
      { id: "MyxmCCZbiw4", title: "How to Call for Help in Emergency Situations" },
      // { id: "gJ5V525SCk", title: "Teaching Children About Emergency Services" }
    ]
  },
  onlinePrivacy: {
    title: "Online Privacy Protection",
    summary: "In today's digital world, protecting your online privacy is essential to prevent identity theft, cyberstalking, harassment, and unauthorized access to your personal information. Strong privacy practices help maintain control over your digital footprint.",
    details: "Digital privacy encompasses control over personal information shared online, including identity details, images, location data, and communication content. Key protection strategies include using strong, unique passwords with two-factor authentication, understanding privacy settings on social platforms, being cautious about oversharing personal information, and recognizing phishing attempts. Children and teenagers are particularly vulnerable to privacy breaches, making education about safe online behavior crucial for their protection.",
    articles: [
      { title: "Online Safety Basics | Stay Safe Online", url: "https://www.staysafeonline.org/articles/online-safety-basics" },
      { title: "Cybersecurity Basics | National Cyber Security Centre (UK)", url: "https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online" },
      { title: "Protecting Your Privacy Online | Consumer Reports", url: "https://www.consumerreports.org/privacy/protecting-your-privacy-online-a1097763687/" },
      { title: "Digital Privacy Tips | Electronic Frontier Foundation", url: "https://www.eff.org/issues/privacy" }
    ],
    videos: [
      { id: "JO55V34EnK8", title: "Protecting Your Digital Footprint" },
      // { id: "gJ5V525SCk", title: "Social Media Privacy Settings Guide" }
    ]
  },
  frauds: {
    title: "Avoiding Frauds & Scams",
    summary: "Frauds and scams target people of all ages through various channels both online and offline. Learning to identify common scam tactics is essential for protecting yourself and your loved ones from financial loss and identity theft.",
    details: "Scammers use sophisticated psychological techniques to create a sense of urgency, authority, or trust to manipulate victims. Common schemes include phishing emails, romance scams, fake job offers, impersonation scams, and investment fraud. Red flags include requests for personal information, pressure to act quickly, payment requests in gift cards or cryptocurrency, and offers that seem too good to be true. Developing a healthy skepticism and verifying information through official channels are key defense strategies.",
    articles: [
      { title: "Scam Alerts | FTC Consumer Information", url: "https://consumer.ftc.gov/scams" },
      { title: "How to Avoid Scams | USA.gov", url: "https://www.usa.gov/avoid-scams-and-fraud" },
      { title: "Online Scams | Europol", url: "https://www.europol.europa.eu/crime-areas-and-trends/crime-areas/cybercrime/online-scams" },
      { title: "Fraud Prevention Tips | Australian Competition and Consumer Commission", url: "https://www.scamwatch.gov.au/get-help/protect-yourself-from-scams" }
    ],
    videos: [
      { id: "CDhAOvsyw2s", title: "How to Identify Common Scams" },
      // { id: "gJ5V525SCk", title: "Protecting Seniors from Financial Fraud" }
    ]
  },
  relationships: {
    title: "Recognizing Unhealthy Dynamics",
    summary: "Understanding healthy versus toxic relationship dynamics is crucial for emotional wellbeing. This knowledge helps identify problematic patterns in various relationships including romantic partnerships, friendships, family dynamics, and work relationships.",
    details: "Healthy relationships are characterized by mutual respect, trust, honest communication, and support for individual growth. In contrast, toxic relationships often feature control, manipulation, inconsistency, disrespect, and boundary violations. Common unhealthy dynamics include gaslighting (making someone question their reality), love bombing followed by withdrawal, isolation from support networks, and cycles of tension, incident, and reconciliation. Feminism, properly understood, advocates for equal rights, opportunities, and respect regardless of gender - not superiority of one gender over another.",
    articles: [
      { title: "Signs of Healthy vs. Toxic Relationships", url: "#" },
      { title: "Understanding Emotional Manipulation", url: "#" },
      { title: "Setting Boundaries in Relationships", url: "#" },
      { title: "Breaking Cycles of Toxicity in Relationships", url: "#" }
    ],
    videos: [
      { id: "gJ5V525SCk", title: "Red Flags in Relationships" },
      { id: "gJ5V525SCk", title: "Building Healthy Relationship Dynamics" }
    ]
  }
};

const LegalRightsPage = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalKey) => {
    setActiveModal(modalKey);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
    <Chatbot />
    <EmergencyButton />
      <Navbar />
      <div className="legal-rights-page">
        {/* Hero Section */}
        <div className="legal-hero">
          <div className="hero-icon">
            <FaGavel />
          </div>
          <div className="hero-content">
            <h1>Legal Rights & Awareness</h1>
            <p className="quote">"Knowledge of your rights is the first step toward empowerment and protection."</p>
          </div>
        </div>
        
        {/* Options Grid */}
        <div className="legal-options-container">
          <h2>Essential Safety & Rights Information</h2>
          <div className="legal-grid">
            <div className="legal-option">
              <div className="option-icon">
                <FaExclamationTriangle />
              </div>
              <h3>What is Harassment</h3>
              <p>Learn to identify different forms of harassment and steps to take when facing it</p>
              <button className="option-btn" onClick={() => openModal('harassment')}>Learn More</button>
            </div>
            
            <div className="legal-option">
              <div className="option-icon">
                <FaBook />
              </div>
              <h3>Sex Education Essentials</h3>
              <p>Age-appropriate information about consent, boundaries, and personal safety</p>
              <button className="option-btn" onClick={() => openModal('sexEd')}>Learn More</button>
            </div>
            
            <div className="legal-option">
              <div className="option-icon">
                <FaPhone />
              </div>
              <h3>Emergency Numbers</h3>
              <p>Important helpline numbers you should save for different emergency situations</p>
              <button className="option-btn" onClick={() => openModal('emergencyNumbers')}>View Numbers</button>
            </div>
            
            <div className="legal-option">
              <div className="option-icon">
                <FaShieldAlt />
              </div>
              <h3>Online Privacy Protection</h3>
              <p>Practical tips to safeguard your personal information and digital footprint</p>
              <button className="option-btn" onClick={() => openModal('onlinePrivacy')}>Safeguard Now</button>
            </div>
            
            <div className="legal-option">
              <div className="option-icon">
                <FaUserSecret />
              </div>
              <h3>Avoiding Frauds & Scams</h3>
              <p>How to recognize and protect yourself from common online and offline scams</p>
              <button className="option-btn" onClick={() => openModal('frauds')}>Stay Safe</button>
            </div>
            
            {/* <div className="legal-option">
              <div className="option-icon">
                <FaHeartBroken />
              </div>
              <h3>Recognizing Unhealthy Dynamics</h3>
              <p>Understanding toxicity, healthy relationships, and setting boundaries</p>
              <button className="option-btn" onClick={() => openModal('relationships')}>Understand More</button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Modal for each option */}
      {activeModal && (
        <Modal 
          isOpen={!!activeModal}
          onClose={closeModal}
          title={modalContent[activeModal].title}
        >
          <div className="modal-body">
            <div className="modal-summary">
              <p>{modalContent[activeModal].summary}</p>
            </div>
            <div className="modal-details">
              <h3>Detailed Information</h3>
              <p>{modalContent[activeModal].details}</p>
            </div>
            <div className="modal-resources">
              <div className="resource-section">
                <h3>Related Articles</h3>
                <ul className="resource-list">
                  {modalContent[activeModal].articles.map((article, idx) => (
                    <li key={idx} className="resource-item">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="resource-section">
                <h3>Related Videos</h3>
                {modalContent[activeModal].videos.map((video, idx) => (
                  <div key={idx} className="video-container">
                    <iframe
                      title={video.title}
                      src={`https://www.youtube.com/embed/${video.id}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default LegalRightsPage;