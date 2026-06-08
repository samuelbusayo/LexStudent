// Quiz seed data — append new entries to quizSeed to add questions for more topics.
// Each topic is identified by (courseId, topicName) to map onto existing curriculum topics.
// The seed importer is idempotent: if a topic already has questions, it's skipped.

export const quizSeed = [
  {
    courseId: 1,
    topicName: 'WK 3: Overview of professional ethics and History of the Legal profession in Nigeria',
    scenarios: [
      {
        key: 'history-orientation',
        text:
          'On the first day of your orientation programme at the Nigerian Law School, you were given an assignment to conduct an extensive research on the history of the legal profession in Nigeria. Answer the following questions.\n\n' +
          'From your research, you discovered that the history of the legal profession in Nigeria can be divided into {{1}} stages. ' +
          'The first stage was between {{2}} and the categories of legal practitioners that practiced in Nigeria then did not include {{3}}. ' +
          'You discovered that the license that was given to local attorneys was for a period of {{4}}. ' +
          'There were {{5}} Inns of court in England into which lawyers were admitted which included all but one of the following {{6}}. ' +
          'You quickly listed the deficiencies which an English trained lawyer practicing in Nigeria then encountered being the under listed except {{7}}.\n\n' +
          'In the course of your research, you got to a part dealing with the Unsworth Committee which was established in the year {{8}}. ' +
          "Membership of the Committee did not include {{9}}. At the end of the Committee's deliberations, it came up with a total number of {{10}} recommendations.\n\n" +
          'You were so excited when you got to the part dealing with the Nigerian Law School. The Nigerian Law School was established in {{11}} and commenced activities in {{12}} but full academic course didn\'t take off until {{13}} and graduates from Nigerian Universities were admitted in {{14}}.',
      },
      {
        key: 'jackie-chan',
        text:
          'Professor Jackie Chan, a Chinese man who had taught law in the University of Wuhan for more than 15 years, was invited by Babcock University in January, 2015 as an expatriate to teach the University students International Trade Law. After spending 5 years in Nigeria, Professor Jackie Chan is considering the prospect of being able to practice as a legal practitioner in Nigeria and has called you, as one of his students, to advise him on his eligibility and the procedures he needs to follow to realise his aspirations.',
      },
      {
        key: 'three-practitioners',
        text:
          'Three legal practitioners, Funke Akindele, Olisa Metuh and Kemi Adetiba who are 10, 8 and 7 years respectively at the Bar, decided to set up a law firm and practice together. They rented a big office space at Sterling Towers, Marina Road, Lagos Island and started their law practice together.',
      },
    ],
    questions: [
      // Blank-style questions tied to scenario 'history-orientation'
      { scenario: 'history-orientation', blank: 1,
        options: ['3', '4', '2', '5'], correct: 0,
        explanation: 'The history of the development of the legal profession in Nigeria is divided into three stages: 1876–1914, 1914–1962, and 1962 till date.' },
      { scenario: 'history-orientation', blank: 2,
        options: ['1874 and 1914', '1876 and 1913', '1876 and 1914', '1873 and 1914'], correct: 2 },
      { scenario: 'history-orientation', blank: 3,
        options: ['Professionally trained lawyers', 'Lawyers called to the Nigerian Bar', 'Articled lawyers', 'Local attorneys'], correct: 1,
        explanation: 'There were three categories of lawyers that could practice in Nigeria between 1876 and 1914. During that period it was not possible to be called to a Nigerian Bar because there was no Nigerian Bar.' },
      { scenario: 'history-orientation', blank: 4,
        options: ['3 months renewable for another 3 months', '4 months renewable for another 4 months', '5 months renewable for another 5 months', '6 months renewable for another 6 months'], correct: 3,
        explanation: 'The license granted to local attorneys during the first stage was for 6 months, renewable for another 6 months.' },
      { scenario: 'history-orientation', blank: 5,
        options: ['3', '4', '5', '2'], correct: 1,
        explanation: "There are 4 Inns of Court in England: Lincoln's Inn, Gray's Inn, Inner Temple and Middle Temple." },
      { scenario: 'history-orientation', blank: 6,
        options: ["Queen's Inn", "Lincoln's Inn", 'Inner Temple', "Gray's Inn"], correct: 0 },
      { scenario: 'history-orientation', blank: 7,
        options: [
          'They studied under the Unitary system of government while Nigeria operated Federal system',
          'They studied English cases which were more binding in Nigerian courts',
          'There was lack of appreciation of the local laws in Nigeria',
          'In England, they were trained as either Barristers or solicitors, while there was fusion of both in Nigeria',
        ], correct: 1 },
      { scenario: 'history-orientation', blank: 8,
        options: ['1957', '1958', '1959', '1960'], correct: 2,
        explanation: 'The Unsworth Committee was set up in 1959. The Committee came up with a total of 28 recommendations.' },
      { scenario: 'history-orientation', blank: 9,
        options: ['Legal Secretary of Southern Cameroon', 'Solicitor General of the Federation', '6 distinguished legal practitioners', 'None of the above'], correct: 3 },
      { scenario: 'history-orientation', blank: 10,
        options: ['28', '24', '12', '15'], correct: 0 },
      { scenario: 'history-orientation', blank: 11,
        options: ['1960', '1961', '1962', '1963'], correct: 2 },
      { scenario: 'history-orientation', blank: 12,
        options: ['January 1963', 'March 1963', 'October 1963', 'January 1964'], correct: 0 },
      { scenario: 'history-orientation', blank: 13,
        options: ['1964', '1965', 'Later that same year', 'None of the above'], correct: 2 },
      { scenario: 'history-orientation', blank: 14,
        options: ['1963', '1964', '1965', '1966'], correct: 2 },

      // Scenario 'jackie-chan' full-prompt questions
      { scenario: 'jackie-chan',
        prompt: 'None of the following, except one, is correct:',
        options: [
          'Professor Jackie Chan, having taught law in Nigeria for more than 5 years, is qualified for total exemption from attending the Nigerian Law School',
          'Professor Jackie Chan, having been a professor of law for more than 15 years, is automatically entitled to practice law generally in Nigeria',
          'Professor Jackie Chan, having taught law in Nigeria for more than 5 years, qualifies for partial exemption in the Nigerian Law School',
          'Professor Jackie Chan, having taught law for just 5 years in Nigeria, is not qualified for any exemption from Nigerian Law School',
        ], correct: 3,
        explanation: 'As a foreigner from a non-common-law jurisdiction, he can only be entitled to partial exemption, and only after teaching law in a Nigerian University for more than 10 years.' },
      { scenario: 'jackie-chan',
        prompt: 'Assuming Professor Jackie Chan is a citizen of the United Kingdom, and has taught law for more than 20 years at the University of Cambridge before being invited to Nigeria as an Emeritus Professor to teach law at the University of Ibadan in 2015 and still desires to practice in Nigeria, then:',
        options: [
          'He will be qualified for total exemption from Nigerian Law School',
          'He will be qualified for partial exemption from Nigerian Law School',
          'He will be entitled to practice by virtue of his position as an Emeritus Professor of the Premier University',
          'He does not qualify for exemption from Nigerian Law School',
        ], correct: 1,
        explanation: 'He qualifies for partial exemption because the UK is a common-law jurisdiction and he has taught law in a Nigerian University for 5 years.' },
      { scenario: 'jackie-chan',
        prompt: 'Professor Jackie Chan was accused of raping one of his students and has been charged before the High Court of Oyo State. He seeks to bring in Mr. Harvey Specter, a senior lawyer in the UK, to represent him. Mr. Specter will be able to represent him when granted a warrant by:',
        options: ['The Attorney General of the Federation', 'The Minister of Internal Affairs', 'The President of the Federal Republic of Nigeria', 'The Chief Justice of Nigeria'],
        correct: 3, explanation: 'The warrant is that of the Chief Justice of Nigeria.' },
      { scenario: 'jackie-chan',
        prompt: 'One of the following is not a condition to be fulfilled before the warrant is granted:',
        options: [
          'Mr. Harvey must be qualified to practice in the United Kingdom',
          'The legal system in the United Kingdom must be similar to that of Nigeria',
          'Professor Jackie Chan must have paid the sum of ₦50,000 as application for warrant fee on behalf of Mr. Harvey Specter',
          'None of the above',
        ], correct: 2, explanation: 'The application fee is 50 kobo (₦0.50), not ₦50,000.' },

      // Scenario 'three-practitioners'
      { scenario: 'three-practitioners',
        prompt: 'The three legal practitioners qualified to practice the legal profession in Nigeria when:',
        options: ['They received their qualifying certificates', 'They received their call to bar certificates', 'They were called to the Nigerian Bar', 'They got their names enrolled at the Supreme Court'],
        correct: 3, explanation: "It is not enough to be called to the Nigerian Bar; one's name must also be enrolled to be able to practice generally in Nigeria (see the Legal Practitioners Act)." },
      { scenario: 'three-practitioners',
        prompt: 'The three legal practitioners are qualified to:',
        options: ['Practice generally in Nigeria', 'Practice in Nigeria for the purpose of a particular proceeding', 'Practice by virtue of their office', 'All of the above'],
        correct: 0, explanation: 'Anyone called to the Nigerian Bar and enrolled at the Supreme Court is entitled to practice generally in Nigeria.' },

      // Standalone (no scenario)
      { prompt: 'During dinner at the Nigerian Law School, the correct sitting order for members on the high table is:',
        options: [
          'Principal members of NLS on the first row, members of the Body of Benchers on the second row, other academic staff of NLS on the third row',
          'Principal members of NLS on the first row, other academic staff of NLS on the second row, members of the Body of Benchers on the third row',
          'Members of the Body of Benchers on the first row, principal members of NLS on the second row, other academic staff of NLS on the third row',
          'Members of the Body of Benchers on the first row, other academic staff of NLS on the second row, principal members of NLS on the third row',
        ], correct: 0 },
      { prompt: 'One of the following is not among the categories of persons entitled to practice law in Nigeria under the Legal Practitioners Act Cap L11 2004:',
        options: ['Those entitled to practice by virtue of their office', 'Those entitled to practice with leave of the Court', 'Those entitled to practice for the purpose of particular proceedings', 'Those entitled to practice generally'],
        correct: 1, explanation: 'Section 24 LPA.' },
      { prompt: 'One of the following is not a necessary condition to be fulfilled by aspirants to the Nigerian Bar:',
        options: ['Success at Law School Portfolio Assessment', 'Nigerian Citizenship', 'Good Conduct', 'Success at Bar Part II Examinations'],
        correct: 1, explanation: 'There are Ghanaians and other Africans called to the Nigerian Bar — Nigerian citizenship is not a condition precedent.' },
    ],
  },
  {
    courseId: 1,
    topicName: 'WK 4: Regulatory Bodies in the Legal profession',
    scenarios: [
      {
        key: 'regulatory-bodies-presentation',
        text:
          'In the fourth week of your resumption at the Nigerian Law School, you were nominated by your group to give a presentation in front of the whole class on the regulatory bodies in the legal profession, exclusive rights and privileges of legal practitioners and limitations on those rights.\n\n' +
          'You began your presentation by stating that the legal profession is a highly regulated profession that comprises different regulatory and controlling bodies each with their distinct functions and powers. ' +
          'For example, the {{1}} is a body of legal practitioners of highest distinction in the legal profession in Nigeria. ' +
          'It is established by {{2}} and has all the following as its functions except {{3}}. ' +
          'And whenever the body is meeting, its quorum shall be {{4}}.\n\n' +
          'The second regulatory body you discussed was the Legal Practitioners Disciplinary Committee. ' +
          'You explained to the class that the {{5}} sets up the Legal Practitioners Disciplinary Committee (LPDC) while the {{6}} prepares the procedural rules used by the Committee. ' +
          'In your words: "The Committee was established by section 10 of the Legal Practitioners Act and is charged with the responsibility to determine and consider charges brought against legal practitioners in Nigeria who have misbehaved." ' +
          'You went ahead to state that the Committee comprises {{7}} members which includes all but one of the following {{8}}. ' +
          'At the end of your presentation on the LPDC, a member of the class asked you a question on the quorum for the meeting of the Committee and your answer was {{9}}.\n\n' +
          'You moved ahead to the third regulatory body on your list, the Council of Legal Education. ' +
          '"The Council of Legal Education is the Body primarily responsible for the education of persons aspiring to be members of the legal profession in Nigeria. It is the proprietor of the Nigerian Law School. ' +
          'The proper designation of the head of the Council of Legal Education is the {{10}} who is appointed by {{11}} on the recommendation of {{12}} and stays in office for {{13}}."',
      },
      {
        key: 'efunsetan-aniwura',
        text:
          'Mrs Efunsetan Aniwura was called to the Nigerian Bar in 2010 when she was just 21. She has always had the passion to be the best in all her endeavours and attain the highest position in her career, in this regard, the rank of the Senior Advocate of Nigeria. ' +
          'In 2011, she obtained a loan of ₦10,000,000 (Ten Million Naira) from First Bank of Nigeria PLC which she used to acquire a big office space in Awolowo, Ibadan. She furnished the office with the necessary equipment and items that would enhance her practice. ' +
          'Over the years, she has carved a niche of excellence for herself and handles all the high profile cases in Ibadan. She has over 10 fee earners working for her. One of her 2020 goals is to be the youngest Senior Advocate of Nigeria.',
      },
      {
        key: 'high-court-precedence',
        text:
          'On the 20th day of August, 2019, you accompanied your principal to the Lagos State High Court where you met the following persons: ' +
          'Kingsley, Chief Law Officer of the Federation; Olalere, a Senior Advocate of 10 years in the inner Bar; John, a life Bencher; Johnson, the AG of Lagos State; and Caleb, the oldest lawyer in the profession with 45 years post call.',
      },
      {
        key: 'enrolment-fee',
        text:
          'The ₦5,000 you are required to pay within one month of your enrolment is called {{1}}, prescribed by {{2}} and paid to {{3}}.',
      },
      {
        key: 'sisi-akowe',
        text:
          'Sisi Akowe followed her principal, Mr. Tolu Akande, to court on the first day of her law firm attachment. ' +
          'She noticed that most of the lawyers coming into the court avoided the front seats; rather they took other seats behind. Quite confused, Sisi Akowe asked her principal why that happened. ' +
          'Before he could answer, her principal\'s matter — which was the last on the list — was called. When he was done with his matter, Sisi Akowe noticed that her principal did not pack his bag unlike other lawyers before him. ' +
          'He waited for the judge to rise, after which he and another counsel who also waited left the court room together.',
      },
      {
        key: 'pius-braimo',
        text:
          'Chief Pius Braimo is a Legal Practitioner and Notary Public for Nigeria with his law office at Shagamu. He does not belong to the local branch of the Nigerian Bar Association. ' +
          'Anytime he appears at the Shagamu High Court, he usually sits at the Inner Bar, claiming to be a Notary Public and so should be heard before other Legal Practitioners. ' +
          'Chief Ayeni is also a Legal Practitioner of over 30 years at the Bar. He appeared in the same court with Chief Pius Braimo. ' +
          'Chief Braimo, who is twelve years at the Bar, desires to mention his cases before Chief Ayeni, claiming that he is a Notary Public.',
      },
      {
        key: 'marys-logbook',
        text:
          'During the recently concluded portfolio assessment at the Nigerian Law School, Mary, a student, recorded entries in her log book describing courtroom encounters. ' +
          'In one entry she described witnessing Mr. Okeke Dabo, a non-lawyer, prosecuting his personal matter in court. ' +
          'In another, she described a dismissed Magistrate appearing in court and prosecuting a matter for his client at the High Court.',
      },
    ],
    questions: [
      // Regulatory bodies presentation — blanks 1–13
      { scenario: 'regulatory-bodies-presentation', blank: 1,
        options: ['The Council of Legal Education', 'The Body of Benchers', 'The Nigerian Bar Association', 'The National Judicial Council'], correct: 1 },
      { scenario: 'regulatory-bodies-presentation', blank: 2,
        options: ['Section 1 of the Body of Benchers Act', 'Section 2 of the Legal Education Act', 'Section 3 of the Legal Practitioners Act', 'Section 4 of the Legal Practitioners Act'], correct: 2 },
      { scenario: 'regulatory-bodies-presentation', blank: 3,
        options: ['Prescription of call fees to be paid by aspirants of the Bar', 'Prescription of dining terms to aspirants of the Bar', 'Issuance of certificate of Call to Bar to new wigs', 'Issuance of qualifying certificates to aspirants of the Bar'],
        correct: 3, explanation: 'Issuance of qualifying certificates is the function of the Council of Legal Education.' },
      { scenario: 'regulatory-bodies-presentation', blank: 4,
        options: ['10', '11', '12', '15'], correct: 0 },
      { scenario: 'regulatory-bodies-presentation', blank: 5,
        options: ['The Body of Benchers', 'The Nigerian Bar Association', 'The President of the Court of Appeal', 'The Chief Justice of Nigeria'],
        correct: 0, explanation: 'The LPDC is a Committee of the Body of Benchers.' },
      { scenario: 'regulatory-bodies-presentation', blank: 6,
        options: ['Chairman of the Legal Practitioners Disciplinary Committee', 'Attorney General of the Federation', 'Chief Justice of Nigeria', 'President of the Court of Appeal'],
        correct: 2, explanation: 'The CJN prescribes the Rules of Procedure of the Committee.' },
      { scenario: 'regulatory-bodies-presentation', blank: 7,
        options: ['10', '11', '15', '20'], correct: 1 },
      { scenario: 'regulatory-bodies-presentation', blank: 8,
        options: ['President of the Court of Appeal', 'Two Chief Judges', 'A Justice of the Supreme Court', 'Four members of the Nigerian Bar Association'], correct: 2 },
      { scenario: 'regulatory-bodies-presentation', blank: 9,
        options: ['7', '5', '9', '11'], correct: 1 },
      { scenario: 'regulatory-bodies-presentation', blank: 10,
        options: ['Chairman', 'Director General', 'President', 'Provost'], correct: 0 },
      { scenario: 'regulatory-bodies-presentation', blank: 11,
        options: ['The Body of Benchers', 'The Attorney General of the Federation', 'The Chief Justice of Nigeria', 'President of Nigeria'], correct: 3 },
      { scenario: 'regulatory-bodies-presentation', blank: 12,
        options: ['National Judicial Council', 'Chief Justice of Nigeria', 'Director General of NLS', 'Attorney General of the Federation'], correct: 3 },
      { scenario: 'regulatory-bodies-presentation', blank: 13,
        options: ['3 years', '2 years', '5 years', '4 years'], correct: 3 },

      // Standalone — lecturer follow-ups (Q14–15)
      { prompt: 'One of the following is not cloaked with juristic personality:',
        options: ['The Body of Benchers', 'The Council of Legal Education', 'The Nigerian Bar Association', 'None of the above'],
        correct: 2, explanation: 'The Nigerian Bar Association is not a juristic person because it is not a creation of the law — there is no Act or Law which established it. (The Registered Trustees of the NBA is, however, a juristic person.)' },
      { prompt: 'The Chief Justice of Nigeria is the Chairman of which of the following regulatory bodies:',
        options: ['The National Judicial Council', 'The Legal Practitioners Privileges Committee', 'A and B', 'None of the above'],
        correct: 2, explanation: 'The CJN is Chairman of both the NJC and the LPPC. See Sec. 5(3) LPA and the Third Schedule to the 1999 Constitution as amended.' },

      // Mrs Efunsetan Aniwura scenario — Q16–22
      { scenario: 'efunsetan-aniwura',
        prompt: 'The body responsible for the conferment of the rank of Senior Advocate of Nigeria is:',
        options: ['The Body of Benchers', 'The Legal Practitioners Privileges Council', 'The Council of Senior Advocates of Nigeria', 'The Legal Practitioners Privileges Committee'],
        correct: 3 },
      { scenario: 'efunsetan-aniwura',
        prompt: 'How many years post-call is required of Mrs Efunsetan Aniwura before she can be conferred with the rank?',
        options: ['10 years', '12 years', '15 years', '8 years'], correct: 0 },
      { scenario: 'efunsetan-aniwura',
        prompt: 'All of the following are correct about the processing fee required of applicants for the rank of Senior Advocate of Nigeria except:',
        options: ['The sum is ₦600,000', 'It is non-refundable', 'The sum is ₦200,000', 'None of the above'],
        correct: 2, explanation: 'Every applicant for the rank of SAN shall pay a non-refundable processing fee in the sum of ₦600,000 or such amount as may be fixed by the LPPC. Section 9(3) of the Guidelines for the Conferment of the Rank of SAN 2018.' },
      { scenario: 'efunsetan-aniwura',
        prompt: 'To be qualified for the prestigious rank, Mrs Efunsetan Aniwura is required to show:',
        options: [
          'Particulars of 29 contested cases: 3 at the Supreme Court, 6 at the Court of Appeal, 20 at the High Court',
          'Particulars of 29 contested cases: 3 at the Supreme Court, 4 at the Court of Appeal, 22 at the High Court',
          'Particulars of 27 contested cases: 3 at the Supreme Court, 4 at the Court of Appeal, 20 at the High Court',
          'Particulars of 29 contested cases: 4 at the Supreme Court, 5 at the Court of Appeal, 20 at the High Court',
        ], correct: 3,
        explanation: 'Applicants for the rank of SAN must show particulars of 20 final judgments of the High Court, 5 of the Court of Appeal and 4 of the Supreme Court. Section 14(5) of the Guidelines, 2018.' },
      { scenario: 'efunsetan-aniwura',
        prompt: 'The following restrictions apply to Senior Advocates of Nigeria except:',
        options: [
          'They shall not draft any instrument where the charge is below ₦400',
          'They shall not handle any pro bono case personally, but shall give it to their junior',
          'They shall not appear in any criminal case alone without a junior counsel',
          'B and C',
        ], correct: 3,
        explanation: 'Nothing prevents SANs from handling pro bono cases themselves, and they can appear alone without a junior in a criminal case (the restriction is on civil cases).' },
      { scenario: 'efunsetan-aniwura',
        prompt: 'Assuming Mrs Efunsetan Aniwura was finally conferred the rank of Senior Advocate of Nigeria, the annual practising fee she would be required to pay is:',
        options: ['₦50,000', '₦20,000', '₦40,000', '₦15,000'], correct: 0 },
      { scenario: 'efunsetan-aniwura',
        prompt: 'Whenever Mrs Efunsetan Aniwura is conferred with the rank of Senior Advocate of Nigeria, her privileges include all but one of the following:',
        options: [
          'The right to sit in the inner bar',
          'The right to wear the silk',
          'The right to mention her application out of turn',
          'The right to be appointed the President of the NBA',
        ], correct: 3 },

      // Standalone — RPC authorship (Q23)
      { prompt: 'The Rules of Professional Conduct were made by:',
        options: ['The Nigerian Bar Association', 'The Attorney General of the Federation', 'The General Council of the Bar', 'The Legal Practitioners Disciplinary Committee'],
        correct: 2, explanation: 'The General Council of the Bar is responsible for making and revising the Rules of Professional Conduct for lawyers.' },

      // High Court precedence scenario — Q24
      { scenario: 'high-court-precedence',
        prompt: "Which of the following is the correct order of their precedence according to the Legal Practitioners' Act?",
        options: [
          'Kingsley, Johnson, Caleb, John and Olalere',
          'Kingsley, Johnson, John, Olalere and Caleb',
          'Johnson, John, Olalere, Kingsley and Caleb',
          'Johnson, Olalere, John, Kingsley and Caleb',
        ], correct: 1,
        explanation: 'The AGF is also the Chief Law Officer of the Federation. Order of precedence: AGF, AGs in their State, Life Benchers, SANs in order of conferment, persons authorised to practise by virtue of office, persons whose names are on the roll in order of seniority, and persons authorised to practise by warrant.' },

      // Enrolment fee scenario — blanks 1–3 (Q25–27)
      { scenario: 'enrolment-fee', blank: 1,
        options: ['Call to Bar fee', 'Annual Practicing fee', 'Nigerian Bar Association fee', 'Roll number fee'],
        correct: 1, explanation: 'Rule 9, RPC.' },
      { scenario: 'enrolment-fee', blank: 2,
        options: [
          'The Body of Benchers after consultation with the Nigerian Bar Association',
          'The Nigerian Bar Association',
          'The Legal Practitioners Remuneration Committee',
          'The Attorney General of the Federation after consultation with the Nigerian Bar Association',
        ], correct: 0,
        explanation: 'Section 10(1)(d) LPA — the Body of Benchers prescribes fees to be paid by legal practitioners after consultation with the NBA.' },
      { scenario: 'enrolment-fee', blank: 3,
        options: ['Nigerian Bar Association', 'Body of Benchers', 'Registrar of the Supreme Court', 'Any of the above'],
        correct: 2, explanation: 'The Annual Practising Fee of legal practitioners is paid to the Registrar of the Supreme Court.' },

      // Standalone — dinner, exclusive rights, prohibitions, NBA functions (Q28–31)
      { prompt: 'The rules guiding the conduct of dinner for candidates of the Nigerian Bar were prescribed by:',
        options: ['The Council of Legal Education', 'The Body of Benchers', 'The Nigerian Law School', 'The Nigerian Bar Association'],
        correct: 1, explanation: 'Prescription of dining rules is one of the functions of the Body of Benchers.' },
      { prompt: 'One of the following is not an exclusive right of legal practitioners:',
        options: ['Appointment as notary public', 'Statutory declaration of compliance', 'Registration of business name', 'None of the above'],
        correct: 2, explanation: 'Registration of business names and companies is not part of the exclusive rights of legal practitioners. Note that the statutory declaration is also no longer an exclusive right.' },
      { prompt: 'A lawyer who is in active legal practice is prohibited from being:',
        options: ['The Managing Director of a company', 'A shareholder of a company', 'The Chairman of a company', 'A non-executive director of a company'],
        correct: 0, explanation: 'Managing Director is an executive officer; Chairman is non-executive. Rule 7(3), RPC.' },
      { prompt: 'The following are functions of the Nigerian Bar Association except:',
        options: [
          'Maintenance of the honour and independence of the Bar',
          'Investigating complaints against legal practitioners found wanting',
          'Promotion of legal education and law reforms',
          'None of the above',
        ], correct: 3 },

      // Sisi Akowe scenario — Q32–34
      { scenario: 'sisi-akowe',
        prompt: 'The reason the front row was avoided by Mr. Tolu Akande and other lawyers was because:',
        options: [
          'The seat was reserved for Senior Advocates and Benchers',
          'The seat was reserved for Senior Advocates, Benchers and Attorneys-General',
          'The seat was reserved for Senior Advocates, life Benchers and Attorneys-General',
          'The seat was reserved for Senior Advocates, life Benchers, Attorneys-General and Notaries Public',
        ], correct: 2 },
      { scenario: 'sisi-akowe',
        prompt: 'Another privilege enjoyed by the category of persons identified above is:',
        options: [
          'Right to mention all their cases out of turn',
          'Right to mention matters for trial out of turn',
          'Right to mention any motion in which he is appearing out of turn',
          'Right to have their matter adjourned sine die',
        ], correct: 2, explanation: 'See Sec. 8 of the LPA.' },
      { scenario: 'sisi-akowe',
        prompt: 'All but one of the following statements is incorrect:',
        options: [
          'Only a legal practitioner can prepare all instruments for fees, gains or rewards',
          'Only a legal practitioner can legally sign documents to be admissible in court',
          'Only a legal practitioner can prepare instruments relating to immovable property for fees, gains or rewards',
          'Only a legal practitioner can incorporate companies under the Companies and Allied Matters Act',
        ], correct: 2, explanation: 'Sec. 22 of the LPA — preparation of instruments relating to immovable property for fees is the correct one; the others are not exclusive.' },

      // Pius Braimo scenario — Q35–36
      { scenario: 'pius-braimo',
        prompt: 'The title of Notary Public of Nigeria is conferred on:',
        options: [
          'Legal Practitioners who have been conferred with the rank of Senior Advocates of Nigeria',
          'Legal Practitioners who have practised law for a period of ten years',
          'Legal Practitioners who have practised law for a period of ten years and have appeared in the High Court in five civil cases',
          'Legal Practitioners of exemplary character who have practised law for not less than 10 years and have paid their practising fees for not less than seven years',
        ], correct: 3 },
      { scenario: 'pius-braimo',
        prompt: 'The title "Notary Public of Nigeria" is conferred on Legal Practitioners by the:',
        options: ['Chief Justice of Nigeria', 'Nigerian Bar Association', 'General Council of the Bar', 'Legal Practitioners Privileges Committee'],
        correct: 0 },

      // Standalone — practice & exclusive rights (Q37–38)
      { prompt: 'One of the following is incorrect:',
        options: [
          'A lawyer who practises at the Bar can engage in any other profession if permitted by the Bar Council',
          'A director of a registered company shall not appear as an advocate in court or in a judicial tribunal for his company',
          'A retired judicial officer cannot represent himself in court',
          'A lawyer who has not paid his practising fee will be denied right of audience',
        ], correct: 2, explanation: 'Atake v Afejuku; Rule 8(3), RPC.' },
      { prompt: 'To enjoy the exclusive rights of legal practitioners in Nigeria, a lawyer must do all the following except:',
        options: [
          'Payment of practising fees promptly',
          'The appropriate use of seal and stamp',
          'Participating in mandatory continuing legal education',
          'Contesting for executive positions of the NBA',
        ], correct: 3 },

      // Mary's log book scenario — Q39–40
      { scenario: 'marys-logbook',
        prompt: 'Which of the following is a correct statement in respect of Mr. Okeke Dabo (the non-lawyer prosecuting his personal matter in court)?',
        options: [
          'The RPC prohibits him from prosecuting any case in court unless he is called to the Bar',
          'He may prosecute his personal case in court',
          'He may prosecute his personal case in court provided he does not cite legal authorities and use legal jargon',
          'He may prosecute cases in court but may not form a law firm',
        ], correct: 1, explanation: 'Sec. 36(6)(c), CFRN — a person may defend or prosecute his own case in person.' },
      { scenario: 'marys-logbook',
        prompt: 'Which of the following is true of the dismissed Magistrate appearing in court and prosecuting a matter for his client at the High Court?',
        options: [
          'Having been dismissed, the Magistrate has no right of audience in court',
          'The Magistrate, being a judicial officer who is no longer on the bench, can prosecute a matter in court',
          'The Magistrate, being a judicial officer who is no longer on the bench, cannot prosecute a matter in court',
          'The Magistrate is not a judicial officer within the meaning of S.292 of the Constitution and is therefore entitled to prosecute a case in court after leaving the bench',
        ], correct: 3 },
    ],
  },
  {
    courseId: 1,
    topicNames: [
      'WK 5: Duties of Counsel to client',
      'WK 6: Duties of Counsel to court, state, colleagues, and profession',
    ],
    scenarios: [
      {
        key: 'tony-rape-case',
        text:
          'Tony, a 10-year-old girl, was raped by two thugs on her way home from school. She was brutally injured and left to die, but was miraculously rushed to the hospital by passers-by and she survived. ' +
          'Furious and determined to end the lives of the two thugs, Carlee Jackson, the father of Tony, contacted Jimoh Esq and told him of his intention to kill the thugs and, should he be charged to court, Jimoh would defend him. ' +
          'Jimoh advised him to go ahead, saying if he found himself in similar situation, he would have killed the thugs a long time ago.',
      },
      {
        key: 'kanu-v-igwe',
        text:
          'During your externship programme, on one of the days you followed your principal to Court 16 of the High Court of Oyo State, Ibadan, you observed the following which took place in court that day:\n\n' +
          'The case between Yewande Kanu v Odulade Igwe, Suit No. 124/HC/20 was called by the {{1}} from the {{2}}. ' +
          'Thereafter, counsel for the claimant stood up and {{3}} as follows: {{4}}. ' +
          'He then informed the Court that he was {{5}} for his colleague, Mr. Bamiloye Esq, who had been handling the case personally, but had an emergency medical appointment for 9:00 am. ' +
          'In line with his colleague\'s instruction, he therefore applied for {{6}}, till 11:00 am when his colleague would be around. ' +
          'When Mr. Bamiloye arrived, the matter was called again and hearing continued. In the process, Mr. Bamiloye, while trying to persuade the Court, said "My Lord, I am speaking from bar". This means he is telling the Court that {{7}}.',
      },
      {
        key: 'denton-momoh',
        text:
          'Denton West and Momoh Daudu are old-time friends from the Nigerian Law School. Both have been called to the Bar, but while Momoh Daudu is still in active legal practice, Denton West has ventured into business. ' +
          'Recently, one of Denton West\'s duplexes in Lagos was compulsorily acquired by the Lagos State government to be used as a permanent isolation centre for patients. No compensation was paid to her from the compulsory acquisition. ' +
          'She approached her friend, Momoh Daudu, who agreed to take up the case for free. Momoh won the case and the Court awarded monetary compensation of ₦200,000,000 (Two Hundred Million Naira) to the claimant. ' +
          'The money was paid to Momoh Daudu, who remitted it to his personal account because that was the only account he had. He deducted 20% as his professional fee and, after a month, forwarded ₦100,000,000 to Denton West. ' +
          'Denton West was furious by the action and has decided to make sure Momoh Daudu is punished for his acts.',
      },
      {
        key: 'isaac-toogood',
        text:
          'Mr. Isaac Toogood, a legal practitioner, was sometime in 2019 briefed by one Mr. Babe Solomon to prepare a Deed of Assignment in respect of a land he wanted to buy. Prior to that, Mr. Babe had concluded investigations on the land; all Mr. Isaac did was to prepare the final document. ' +
          'In September 2020, Mr. Idowu Laki, a long-time client whose vast properties have always been managed by Mr. Isaac Toogood, requested Mr. Isaac to come to his house where he instructed him to represent him in a matter involving a land dispute between Mr. Idowu and Mr. Babe. ' +
          'Mr. Isaac is now at a loss trying to determine if he can represent Mr. Idowu in the said suit, considering the fact that he had one time prepared the Deed for Mr. Babe with respect to the same land.',
      },
      {
        key: 'abiola-daniel',
        text:
          'Mr. Abiola Daniel was called to the Nigerian Bar in November 2019, and exactly two months after, he established his own private office and employed two of his colleagues to work for him. ' +
          'Mr. Tanko Bako retained Mr. Abiola Daniel to defend him in a case of defamation of character instituted against him by Miss Juliet Azaka. On the 29th of January 2020, the matter came up for hearing before Justice Mukhtar Mumba. ' +
          'Mr. Mohammed Isa, counsel to Miss Juliet, raised an objection to the right of audience of Mr. Abiola Daniel on the ground that he had not paid his practising fee for the year. ' +
          'The Court made a ruling in favour of Mr. Mohammed Isa, who thereafter came out of the Court and granted a brief press conference to journalists where he boasted that his client would definitely win the case.',
      },
      {
        key: 'akin-alabi-courtroom',
        text:
          'In the course of your externship, you witnessed the following in open court. When the case of Mr. Akin Alabi Esq. was called, Mr. Alabi was not in court to conduct the case of his client, but Olorunkiya Seun Esq stood up and announced appearance on behalf of Mr. Akin Alabi and said he would proceed with the case. ' +
          'Shortly during the case, Honourable Justice Chinukwe cautioned Mr. Olorunkiya over his unsavoury use of words on Mrs. Elumelu, the opposing counsel, with regard to her failure to produce a key witness for cross-examination. However, Mr. Olorunkiya did not heed the words of the Judge but continued to berate Mrs. Elumelu.\n\n' +
          'Seun Olorunkiya, as {{1}}, owes a duty to {{2}}.',
      },
      {
        key: 'franklin-onwuegbuchunam',
        text:
          'Franklin Onwuegbuchunam was briefed by Gbedu Bio to represent the latter in a sale transaction involving his property in Asokoro, Abuja. Franklin sold the property to one Miss Yinxie Baby, a profound actor, for the whopping sum of ₦100,000,000. ' +
          'Franklin, who had never dreamt of concluding a transaction that big, thought God had finally answered his prayers. He received the sum on behalf of his client but failed to remit the money to him. ' +
          'He spent ₦20,000,000 to buy his dream car and surprised his girlfriend, whom he took to a 5-star hotel where they both spent a week paying the sum of ₦1,000,000. He lavished a substantial part of the money and paid the remaining ₦30,000,000 into his personal account. ' +
          'Meanwhile, as a result of Franklin\'s greed and his failure to provide best services to his clients, one of whom is James Wellington, whose action has witnessed a series of setbacks in court, James Wellington has debriefed Franklin and engaged the services of Isiaka Mumuni.',
      },
    ],
    questions: [
      // tony-rape-case — Q1–5
      { scenario: 'tony-rape-case',
        prompt: 'Which professional duty has Jimoh Esq. breached from the scenario?',
        options: [
          'Duty to advise his client within the bounds of the law',
          'Duty to prevent the commission of a crime',
          'Duty to uphold the rule of law',
          'All of the above',
        ], correct: 3 },
      { scenario: 'tony-rape-case',
        prompt: 'Assuming Carlee Jackson was eventually arrested and charged before the Court to be prosecuted by Mr. Sunmobo on behalf of the State, based on Rule 37 of the RPC, Mr. Sunmobo\'s primary duty is:',
        options: ['To make sure to convict Carlee Jackson', 'To achieve maximum punishment for the accused', 'To see that justice is done', 'All of the above'],
        correct: 2 },
      { scenario: 'tony-rape-case',
        prompt: 'Assuming it was after he killed the two thugs that Carlee Jackson approached Jimoh Esq and confessed the commission of the crime to him, then Jimoh must:',
        options: ['Make sure to reveal the information to the Court', 'Make sure to keep the information privileged', 'Make sure to put a defence contrary to the confession', 'Any of the above'],
        correct: 1, explanation: 'Rule 37, RPC.' },
      { scenario: 'tony-rape-case',
        prompt: 'The section of the Evidence Act dealing with the privilege of lawyer–client communication is:',
        options: ['Section 97', 'Section 197', 'Section 191', 'Section 192'], correct: 3 },
      { scenario: 'tony-rape-case',
        prompt: 'The circumstances in which a lawyer is permitted to disclose privileged communications with a client include one of the following:',
        options: [
          "Where the client's consent is withheld",
          'Where the communication relates to the confession of a crime',
          'Where the information is not a confidential one',
          'None of the above',
        ], correct: 2 },

      // Standalone — Q6
      { prompt: 'During your externship experience, you noticed that on many occasions, counsel did not leave the courtroom once the number of counsel would otherwise be reduced to one because counsel did not want to:',
        options: ['Empty the Court', 'Reduce quorum of the Court', 'Disgrace the Court', 'Undress the Court'],
        correct: 3 },

      // kanu-v-igwe — blanks 1–7 (Q7–13)
      { scenario: 'kanu-v-igwe', blank: 1,
        options: ['The Judge', 'The Bailiff', 'The Registrar', 'The Clerk'], correct: 2 },
      { scenario: 'kanu-v-igwe', blank: 2,
        options: ['Court list', 'Court book', 'Course list', 'Cause list'], correct: 3 },
      { scenario: 'kanu-v-igwe', blank: 3,
        options: ['Introduced himself', 'Entered appearance', 'Announced appearance', 'Registered appearance'], correct: 2 },
      { scenario: 'kanu-v-igwe', blank: 4,
        options: [
          'With due respect, A.B. Dauda, for the claimant',
          'A.B. Dauda, appearing for the claimant',
          'Barrister A.B. Dauda for the claimant',
          'Any of the above',
        ], correct: 0 },
      { scenario: 'kanu-v-igwe', blank: 5,
        options: ['Watching brief', 'Holding brief', 'Amicus curiae', 'Observing proceedings'], correct: 1 },
      { scenario: 'kanu-v-igwe', blank: 6,
        options: ['An adjournment', 'A stand down', 'A postponement', 'A short recess'], correct: 1 },
      { scenario: 'kanu-v-igwe', blank: 7,
        options: [
          'He is speaking from the seat reserved for lawyers in court',
          'He is speaking as counsel on behalf of his client',
          'He is speaking upon his honour as counsel and should therefore be believed',
          'He is speaking as counsel and not as a judge',
        ], correct: 2 },

      // denton-momoh — Q14–15
      { scenario: 'denton-momoh',
        prompt: 'Which of the following professional duties was breached by Momoh Daudu?',
        options: [
          "Duty to properly account for client's property",
          'Duty to open a client account',
          "Duty not to mix client's property with personal property",
          'All of the above',
        ], correct: 3 },
      { scenario: 'denton-momoh',
        prompt: "The provision of the RPC containing dealings with client's property is in which Rule?",
        options: ['Rule 23', 'Rule 22', 'Rule 24', 'Rule 19'], correct: 0 },

      // Standalone — Q16–17
      { prompt: 'One of the following is not expected of a counsel to his client:',
        options: ['Duty to take instructions in chambers', 'Cab rank rule duty', 'Assuring clients of success', "Duty to open client's account"],
        correct: 2 },
      { prompt: 'Lawyers are enjoined to have offices where they practise and can receive instructions from clients, so as not to breach which Rule of the RPC?',
        options: ['Rule 20', 'Rule 22', 'Rule 21', 'Rule 24'],
        correct: 1, explanation: "Rule 22 prevents calling at a client's house or place of business for the purpose of taking instructions." },

      // isaac-toogood — Q18–20
      { scenario: 'isaac-toogood',
        prompt: "Mr. Isaac is not inclined to go over to Mr. Idowu's house to take instructions. He can only do so in all but one of the following circumstances:",
        options: ['The client is very ill and frail', 'The client is of extreme old age', 'The client cannot visit his law firm due to security reasons', 'The client is in custody'],
        correct: 2 },
      { scenario: 'isaac-toogood',
        prompt: 'In advising Mr. Isaac on whether he can represent Mr. Idowu in the law suit having prepared the Deed of Assignment for Mr. Babe, one of the following is correct:',
        options: [
          'He cannot represent Mr. Idowu in the law suit',
          'He can represent Mr. Idowu after he has disclosed the fact and the former does not object',
          'He can assign another lawyer from his office who was not involved in the preparation of the Deed',
          'None of the above',
        ], correct: 1,
        explanation: 'Onigbongbo Community v Minister of Lagos Affairs — since Mr. Isaac only prepared the final document and did not investigate the title to the land, he may represent Mr. Idowu after disclosure and consent. (Had he investigated the title, he would be obliged to refuse the brief.)' },
      { scenario: 'isaac-toogood',
        prompt: 'What kind of retainership does Mr. Idowu have with the law firm of Mr. Isaac Toogood?',
        options: ['Special retainership', 'General retainership', 'Specific retainership', 'Corporate retainership'],
        correct: 1 },

      // Standalone — Q21–22
      { prompt: "On a lawyer's liability to the client in the face of failure to exercise professional competence, one of the following is not an exception:",
        options: ['When acting on a pro bono basis', 'Filing of a case out of time', 'When acting without remuneration', 'In the case of negligence committed in the face of the Court'],
        correct: 1 },
      { prompt: 'Which of these duties is otherwise called the cab rank rule?',
        options: ['Duty to accept brief', 'Duty to take instruction in chambers', 'Duty to exercise professional competence', "Duty to open client's account"],
        correct: 0 },

      // abiola-daniel — Q23–27
      { scenario: 'abiola-daniel',
        prompt: 'Justice Mukhtar Mumba owes all but one of the following duties to counsel:',
        options: ['To treat counsel with respect', 'To give counsel right of audience in court', 'To entertain counsel in court', 'Not to unnecessarily interfere in the conduct of a case'],
        correct: 2 },
      { scenario: 'abiola-daniel',
        prompt: 'Mr. Abiola Daniel owes Mr. Tanko Bako all but one of the following duties as a client:',
        options: ['Duty to accept brief', 'Duty to take instruction in chambers', 'Duty to avoid conflict of interest', 'Duty to preserve confidential information'],
        correct: 1,
        explanation: 'The duty to take instructions in chambers is not owed to clients — it preserves the dignity of the legal profession.' },
      { scenario: 'abiola-daniel',
        prompt: 'The first annual practising fee of Mr. Abiola Daniel must be / have been paid on or before:',
        options: ['March 2020', 'December 2019', 'October 2020', 'January 2020'],
        correct: 1, explanation: 'Rule 9, RPC.' },
      { scenario: 'abiola-daniel',
        prompt: 'One of the following is not a consequence of failure to pay annual practising fee by legal practitioners:',
        options: ['No right of audience in court', 'Inability to sign processes to be used in court', 'Inability to receive briefs from clients', 'None of the above'],
        correct: 2,
        explanation: 'Failure to pay practising fee does not prevent a legal practitioner from accepting briefs from clients.' },
      { scenario: 'abiola-daniel',
        prompt: 'The conduct of Mr. Mohammed Isa in granting a press conference to journalists boasting that his client will definitely win the case is:',
        options: [
          'Proper as counsel is allowed to do that',
          'Improper as it amounts to contempt of court',
          'Improper as it constitutes a breach of Rule 34 of the RPC',
          'Improper as it constitutes a breach of Rule 33 of the RPC',
        ], correct: 3 },

      // Standalone — Q28–32
      { prompt: 'It is not unethical for a legal practitioner to:',
        options: [
          'Stand surety for a respectable client',
          'Thoroughly investigate facts communicated by his client',
          'Accept an instruction which involves arguing against the interest of a party paying his retainer',
          'Reveal confidential information after the termination of the client–counsel relationship',
        ], correct: 1, explanation: 'A legal practitioner is enjoined to investigate facts presented by clients. Rule 25, RPC.' },
      { prompt: 'Generally, legal practitioners ought to pay their practising fees within what period every year?',
        options: ['3 months', 'On or before the next year March', '6 months', 'None of the above'],
        correct: 3, explanation: 'Practising fee should be paid not later than 31st March every year.' },
      { prompt: 'Murutai Esq is a legal practitioner with 12 years post-call experience; he is neither a Senior Advocate of Nigeria nor a life bencher. How much will he pay as his practising fee?',
        options: ['₦15,000', '₦25,000', '₦17,500', '₦50,000'], correct: 2 },
      { prompt: 'A counsel does not owe any duty to the:',
        options: ['Client', 'State', 'Court', 'None of the above'], correct: 3 },
      { prompt: 'Generally, legal practitioners are not accorded right of audience in court for failure to pay their annual practising fee, but this rule does not apply to the following except:',
        options: ['Senior Advocates of Nigeria', 'Attorneys-General', 'Directors of Public Prosecution', 'Principal States Counsel in Ministry of Justice'],
        correct: 0, explanation: 'Section 8, LPA — AGs, DPPs and Principal States Counsel retain right of audience, but SANs do not.' },

      // akin-alabi-courtroom — Q33 (prompt), Q34–35 (blanks)
      { scenario: 'akin-alabi-courtroom',
        prompt: 'From the scenario, Mr. Olorunkiya is said to be doing what for Mr. Akin Alabi?',
        options: ['Watching brief', 'Holding brief', 'Carrying brief', 'Representing Mr. Akin Alabi'], correct: 1 },
      { scenario: 'akin-alabi-courtroom', blank: 1,
        options: ['Minister in the temple of justice', 'A lawyer in a reputable law firm', 'An officer of the court', 'A and C'],
        correct: 3 },
      { scenario: 'akin-alabi-courtroom', blank: 2,
        options: [
          'Air his grievance against the Judge',
          'Communicate with the Judge',
          'Treat the court with respect, dignity and honour',
          "Solicit for the judge's assistance in conducting his case",
        ], correct: 2 },

      // Standalone — Q36–41
      { prompt: 'Sisi Jennifer was appearing before Hon. Justice Prim and Proper with very long earrings. She was denied right of audience by the Judge as a result of her dressing. According to the RPC, a lawyer owes the court the following duties save:',
        options: ['Duty to appear with a junior counsel', 'Duty to adhere to proper dress code', 'Duty to be decorous', 'Duty to assist the court to attain justice'],
        correct: 0 },
      { prompt: 'Which of the following is not a reason counsel should be punctual to court?',
        options: [
          'The need to have settled down before court sits',
          'The need to wait for court and not the reverse',
          'The need to get familiar with court procedures and witnesses before the Court sits',
          'The need to get acquainted with the court clerk and registrar',
        ], correct: 3 },
      { prompt: 'A lawyer may reasonably refuse to accept brief under all but one of the following circumstances:',
        options: ['Lack of interest', 'Lack of expertise in the area', 'Conflict of interest', 'Failure of client to pay professional fee'],
        correct: 0 },
      { prompt: 'Which of these is not a dereliction of duty to the profession by counsel?',
        options: [
          'Instigating litigation directly or indirectly',
          'Searching of land titles for defects',
          'Counselling agents and other persons to follow up on accidents with intention to have employment',
          'Giving proper advice to those seeking relief against unfaithful and neglectful counsel',
        ], correct: 3, explanation: 'Rule 47, RPC.' },
      { prompt: 'Choose the option that best completes the following passage: "The court started ___ at exactly 9 a.m. when the case was ___ out, ___ announced their appearances and the matter was ___ to 11 a.m. for hearing."',
        options: [
          'Proceedings, announced, counsel, adjourned',
          'Sitting, announced, Counsel, adjourned',
          'Sitting, called up, counsels, stood down',
          'Sitting, called, counsel, stood down',
        ], correct: 3 },
      { prompt: 'In announcing appearance in court, the expression "your Honour" is used before one of the following courts:',
        options: ['Area Court in Gusau, Zamfara State', 'Magistrate Court in Enugu, Enugu State', 'Magistrate Court in Lagos State', 'High Court in Asaba, Delta State'],
        correct: 2, explanation: '"Your Honour" is used to address Magistrates in Lagos State.' },

      // franklin-onwuegbuchunam — Q42–47
      { scenario: 'franklin-onwuegbuchunam',
        prompt: 'The right of James Wellington to debrief a lawyer and change his counsel is contained in what Rule of the RPC?',
        options: ['Rule 18', 'Rule 29', 'Rule 25', 'A and B'],
        correct: 3, explanation: 'The right of a client to debrief counsel is contained in Rules 18 and 29 RPC.' },
      { scenario: 'franklin-onwuegbuchunam',
        prompt: "What duty does Isiaka Mumuni owe Franklin as the latter's client has changed counsel?",
        options: [
          'Duty to notify Franklin of the change of counsel',
          'Duty to join Franklin and prosecute the case jointly',
          'Duty to notify Franklin of the juicy nature of the case',
          'None of the above',
        ], correct: 0, explanation: 'Rule 29, RPC.' },
      { scenario: 'franklin-onwuegbuchunam',
        prompt: 'Assuming James Wellington has defaulted in paying Franklin his outstanding fees, what is the duty of Isiaka Mumuni in this regard?',
        options: [
          'Duty to ensure that Franklin is paid his earned fee',
          'Duty not to accept the brief in solidarity with his colleague',
          'Duty to report the matter to the police',
          'Duty to do the matter pro bono',
        ], correct: 0 },
      { scenario: 'franklin-onwuegbuchunam',
        prompt: 'Which rule of the RPC has Franklin Onwuegbuchunam breached?',
        options: ['Rule 21 RPC', 'Rule 23 RPC', 'Rule 24 RPC', 'Rule 26 RPC'], correct: 1 },
      { scenario: 'franklin-onwuegbuchunam',
        prompt: 'Franklin Onwuegbuchunam, as a member of the legal profession, owes the following duties to the profession except:',
        options: [
          'Aiding unauthorised practice of law',
          'Preventing the admission of unqualified persons to the legal profession',
          'Upholding the rule of law',
          'Maintaining an honourable standard of professional conduct',
        ], correct: 0, explanation: 'A lawyer shall not aid a non-lawyer in the unauthorised practice of law. Rule 3, RPC.' },
      { scenario: 'franklin-onwuegbuchunam',
        prompt: 'Where a counsel knows that he would most likely be called as a witness in a case, then he should:',
        options: [
          'Accept the brief because the cab rank rule admits of no exception',
          'Transfer the case to another person in his firm to handle',
          'Accept the brief, as that does not bar him from testifying in the case',
          'None of the above',
        ], correct: 3, explanation: 'Rule 20, RPC. Where counsel knows he is likely to be called as a witness, he should not accept the brief. The disqualification applies to the firm as a whole.' },

      // Standalone — Q48–50
      { prompt: 'There is no liability for negligence committed when conducting a case in court. This was the ratio in the case of:',
        options: ['Rondel v Worsley', 'Lawson v Sifre', 'Cassidy v Minister of Health', 'Arthur Hall v Simmons'],
        correct: 0 },
      { prompt: "A lawyer shall not wear the Barrister's or Senior Advocate's robe in all of the following circumstances except:",
        options: [
          'As directed by the Bar Council',
          'When conducting his own case as party to a legal proceeding in Court',
          'When giving evidence in a legal proceeding in Court',
          'When attending a procession in his church where they want to recognise him',
        ], correct: 0, explanation: 'Rule 45, RPC.' },
      { prompt: 'A lawyer owes all but one of these duties to his profession:',
        options: [
          'Duty to pay his practising fee',
          'Duty to attend Bar meetings',
          'Duty to preserve the confidentiality of the Bar',
          'Duty to attend the Mandatory Continuing Legal Education Programme',
        ], correct: 2 },
    ],
  },
];

/**
 * Seed a single topic's scenarios and questions.
 * Returns true if seeded, false if skipped (already seeded or topic not found).
 */
function seedOneTopic(db, courseId, topicName, scenarios, questions) {
  const topic = db.prepare(
    'SELECT id FROM topics WHERE course_id = ? AND name = ?'
  ).get(courseId, topicName);

  if (!topic) {
    console.warn(`[quiz_seed] Topic not found: "${topicName}" in course ${courseId} — skipping`);
    return false;
  }

  // Check if this topic already has questions (idempotent)
  const existingCount = db.prepare(
    'SELECT COUNT(*) as cnt FROM quiz_questions WHERE topic_id = ?'
  ).get(topic.id);
  if (existingCount.cnt > 0) {
    return false; // Already seeded
  }

  // Build a map of scenario key -> inserted scenario id
  const scenarioMap = {};
  if (scenarios) {
    const insertScenario = db.prepare(
      'INSERT INTO quiz_scenarios (topic_id, text, order_index) VALUES (?, ?, ?)'
    );
    scenarios.forEach((s, idx) => {
      const info = insertScenario.run(topic.id, s.text, idx);
      scenarioMap[s.key] = info.lastInsertRowid;
    });
  }

  // Insert questions
  const insertQuestion = db.prepare(
    `INSERT INTO quiz_questions (topic_id, scenario_id, blank_number, prompt, options, correct_index, explanation, order_index)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  questions.forEach((q, idx) => {
    const scenarioId = q.scenario ? (scenarioMap[q.scenario] || null) : null;
    insertQuestion.run(
      topic.id,
      scenarioId,
      q.blank || null,
      q.prompt || null,
      JSON.stringify(q.options),
      q.correct,
      q.explanation || null,
      idx
    );
  });

  console.log(`[quiz_seed] Seeded ${questions.length} questions for "${topicName}"`);
  return true;
}

/**
 * Idempotent quiz seed importer.
 * Supports topicName (single) or topicNames (array) per entry.
 * Looks up topics by (courseId, name); skips if not found or already has questions.
 */
export function seedQuizData(db) {
  for (const entry of quizSeed) {
    const names = entry.topicNames || [entry.topicName];
    for (const name of names) {
      seedOneTopic(db, entry.courseId, name, entry.scenarios, entry.questions);
    }
  }
}
