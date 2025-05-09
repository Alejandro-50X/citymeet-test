'use client';
import { useEffect } from 'react';
import { supabase } from "../utils/supabaseClient"
import './resources.css';
import Nav from '../components/Nav';
import SignOutButton from '../components/SignOutButton';

export default function ResourcesPage() {
  /*
  The handleSubmit function is used to process the Customer
  Support data and message submisson
  */
  async function handleSubmit(e) {
    e.preventDefault();
  
    const formData = new FormData(e.target);
  
    const name = formData.get('name');
    const email = formData.get('email');
    const postalCode = formData.get('postalCode');
    const message = formData.get('message');
  
    console.log('Form submitted!', { name, email, postalCode, message });
  //links to the supabase data table "Customer_Support_Messages"
    const { data, error } = await supabase.from('Customer_Support_Messages').insert([
      {
        name,
        email,
        postal_code: postalCode,
        messages: message,
      },
    ]);
  
    if (error) {
      console.error(error);
      alert('There was an error submitting your message.');
    } else {
      alert('Thank you! Your message has been received.');
      e.target.reset();
    }
  }
  /*
  This block of code is used to reveal an answer to a FAQ once 
  clicked upon
  */
  useEffect(() => {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach((q) => {
      q.addEventListener('click', () => {
        const answer = q.nextElementSibling;
        if (answer) {
          answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        }
      });
    });

    return () => {
      questions.forEach((q) => {
        q.replaceWith(q.cloneNode(true));
      });
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-800 text-white relative p-10">
      <Nav />
      <div className="absolute top-4 right-4">
        <SignOutButton />
      </div>

      <div className="container mx-auto px-4 py-24">
      <div className="top-banner">Resources</div> 
        <div className="resources-tab">
          
          <h2>Helpful Links</h2>
          <ul>
            <li><a href="https://dpss.lacounty.gov/en.html" target="_blank">Department of Public Social Services</a></li>
            <li><a href="https://www.governmentjobs.com/careers/LACOUNTY" target="_blank">LA County Job Opportunities</a></li>
            <li><a href="https://www.lafoodbank.org/programs/rapid-food-distribution" target="_blank">LA County Food Drive</a></li>
            <li><a href="https://www.lahsa.org/portal/apps/find-a-shelter/adults" target="_blank">Los Angeles Homeless Services Authority</a></li>
            <li><a href="https://dmh.lacounty.gov/acr/?utm_source=Google&utm_medium=Search&utm_id=ACR&gad_source=1&gad_campaignid=22299664288&gbraid=0AAAAAqpP-DH5K6RpQyuXcNMeJMetdpun4&gclid=CjwKCAjwz_bABhAGEiwAm-P8YXey1-uutP2lGHtfjradNsmuy4EDnavQvvEnFi-mTawBjO0Y5o8h0RoCXQcQAvD_BwE" target="_blank">Department of Mental Health</a></li>
            <li><a href="https://211la.org/resources" target="_blank">Additional Resources</a></li>
          </ul>

          <h2>FAQ</h2>
          <div className="faq-item">
            <div className="faq-question">How do I make a new post?</div>
            <div className="faq-answer">To upload a post,....</div>
          </div>
          <div className="faq-item">
            <div className="faq-question">How do I change my location preferences?</div>
            <div className="faq-answer">To change your location preferences,....</div>
          </div>
          <div className="faq-item">
            <div className="faq-question">How do I add people to my followers/Friends list?</div>
            <div className="faq-answer">To add a friend,....</div>
          </div>
          <div className="faq-item">
            <div className="faq-question">How do I upload my resume to my account?</div>
            <div className="faq-answer">To upload a resume,....</div>
          </div>
          <div className="faq-item">
            <div className="faq-question">How do I report a post?</div>
            <div className="faq-answer">Above a user's post, click the 3 dots and select "Report Post"</div>
          </div>

          <h2>Customer Support</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" name="name" required />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" required />
            </div>
            <div className="form-group">
              <label>Postal Code:</label>
              <input type="text" name="postalCode" />
            </div>
            <div className="form-group">
              <label>Message:</label>
              <textarea name="message" rows="7" required />
            </div>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </main>
  );
}
