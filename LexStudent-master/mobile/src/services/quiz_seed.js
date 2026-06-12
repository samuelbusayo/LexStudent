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
  {
    courseId: 1,
    topicName: 'WK 8: Appointment and Discipline of Judicial Officers and Legal Practitioners',
    scenarios: [
      {
        key: 'justice-adams-removal',
        text:
          'Justice Adams, the Presiding Judge of the Court of Appeal Division, Kwara State, was found guilty of gross misconduct and was removed from the Bench by the Governor of Kwara State.',
      },
      {
        key: 'chiroma-dinner',
        text:
          'During the first dinner out of the three dining terms for students at the Nigerian Law School, the Director General, Professor Chiroma Isa Hiyatu SAN, introduced the presiding Bencher, Honourable Justice Adams Igube, the Chief Judge of the High Court of the Federal Capital Territory. ' +
          'Quickly, you turned to your colleague to refresh your memory on what you were taught that day on appointment of judicial officers.\n\n' +
          'His appointment as Chief Judge is made by the {{1}} upon the recommendation of the {{2}} and requires the confirmation of {{3}}. ' +
          'And in case of his proposed removal from office, one of the following is required: {{4}}.',
      },
      {
        key: 'nic-judges-swearing',
        text:
          'In the course of your externship in 2019, you accompanied your principal to the swearing-in of 19 newly appointed Judges of the National Industrial Court (NIC). They were sworn in by the {{1}}. ' +
          'Your principal later gave you an assignment to briefly state the procedure for their appointment. ' +
          'You stated that the {{2}}, which comprises all but one of the following — {{3}} — advises the {{4}}, who then recommends them to the {{5}}.',
      },
      {
        key: 'goodboy-appointments',
        text:
          'President Goodboy Donatus, on the 12th of June, announced the following appointments: Justice Abiola Kalu as Chief Justice of Nigeria (15 years post-call); Justice Idris Abiodun (12 years post-call) and Emeka Dawodu (10 years post-call) as Justices of the Supreme Court and Court of Appeal respectively. ' +
          'The appointment of Justice Kalu was on the recommendation of the National Judicial Council and approved by the Senate, while those of Justices Abiodun and Dawodu were on the recommendation of the Judicial Service Commission and approved by the House of Representatives.',
      },
      {
        key: 'three-appointments',
        text:
          'Three judicial appointments have just been announced by the Nigerian Television Authority.\n\n' +
          '• The first is Honourable Justice Kotako, Justice of the Supreme Court, whose appointment was made by the Senate President on the recommendation of the Judicial Service Committee of the Federal Capital Territory without any confirmation.\n' +
          '• The second is Honourable Justice Agabi, Chief Judge of Abia State, whose appointment was made by the Abia State Governor without recommendation and confirmation by the Senate.\n' +
          '• The third is Justice Wamako, Chief Judge of the Federal Capital Territory, whose appointment was made by the FCT Minister on the recommendation of the National Judicial Council, and confirmed by the Senate.',
      },
      {
        key: 'agba-akin-removal',
        text:
          'Justice Agba Akin was appointed Chief Judge of Kogi State in 2017. The Governor of Kogi State wanted to remove him as the Chief Judge on grounds of misconduct and inability to perform his duty. ' +
          'The Governor sent an address to the House of Assembly in that regard. The House of Assembly considered the address and invited the Chief Judge to the floor of the House, where a vote was passed and he was removed accordingly.',
      },
      {
        key: 'franklin-onwuegbuchunam-discipline',
        text:
          'Franklin Onwuegbuchunam was briefed by Gbedu Bio to represent him in a sale of land transaction involving his property in Asokoro, Abuja. Franklin sold the property to one Miss Yinxie Baby, a profound actor, for the whopping sum of ₦100,000,000. ' +
          'He received the sum on behalf of his client but failed to remit the money to him. He spent ₦20,000,000 on a dream car and ₦1,000,000 on a week-long stay with his girlfriend at a 5-star hotel; he paid the remaining ₦30,000,000 into his personal account. ' +
          'Meanwhile, as a result of Franklin\'s greed and his failure to provide best services to his clients, James Wellington (one of those clients) debriefed Franklin and, together with Gbedu Bio, has decided to set in motion disciplinary actions against Franklin Onwuegbuchunam.',
      },
      {
        key: 'john-kobe-arrest',
        text:
          'John Kobe Esq, a renowned legal practitioner, has been arrested by the EFCC for obtaining money by false pretence — an offence that attracts 7 years\' imprisonment. ' +
          'Some persons have written an anonymous complaint reporting the arrest of John Kobe Esq to the Chief Registrar of the Supreme Court, who as a result struck John Kobe\'s name off the roll of legal practitioners. ' +
          'This action has caused a serious argument amongst some students of the Nigerian Law School.',
      },
      {
        key: 'denton-momoh-discipline',
        text:
          'Denton West and Momoh Daudu are old-time friends from the Nigerian Law School. Both have been called to the Bar, but while Momoh Daudu is still in active legal practice, Denton West has ventured into business. ' +
          'Recently, one of Denton West\'s duplexes in Lagos was compulsorily acquired by the Lagos State government to be used as a compulsory isolation centre, and no compensation whatsoever was paid to her. ' +
          'She approached her friend, Momoh Daudu, who agreed to take it up for free. Momoh won the case and the Court awarded monetary compensation of ₦200,000,000 to the claimant. ' +
          'The money was paid to Momoh Daudu, who remitted it to his personal account, deducted 20% as his professional fee, and forwarded ₦100,000,000 to Denton West. ' +
          'Denton West was furious and has decided to make sure Momoh Daudu is punished for his acts.',
      },
      {
        key: 'kevin-mike-oba',
        text:
          'Kevin Oba, a legal practitioner, has a brother Vincent Oba, whose first son Mike Oba was a 3rd year law student in Obafemi Awolowo University. ' +
          'In order to help him, Kevin employed Mike in his Chambers, bought him a wig and gown, and assigned cases to him which he handled successfully in court with the help of Kevin. ' +
          'When this was discovered, Kevin quickly procured travelling documents for Mike, with which he travelled to South Africa.',
      },
    ],
    questions: [
      // ─── JUDICIAL OFFICERS — Q1–33 ───

      // justice-adams-removal — Q1–3
      { scenario: 'justice-adams-removal',
        prompt: 'One of the following is not involved in the appointment of Justice Adams as a Justice of the Court of Appeal, Kwara State:',
        options: ['Governor of Kwara State', 'National Judicial Council', 'State Judicial Service Commission', 'A and C'],
        correct: 3, explanation: 'The Governor and State Judicial Service Commission are not involved in the appointment of Justices of the Court of Appeal and the Supreme Court.' },
      { scenario: 'justice-adams-removal',
        prompt: 'The following are grounds for the removal of a Judicial Officer except:',
        options: ['Inability to discharge the duties of his office', 'Inability to provide for his family', 'Misconduct', 'Contravention of the Code of Conduct'],
        correct: 1 },
      { scenario: 'justice-adams-removal',
        prompt: 'Only one of the following has the power to remove Justice Adams as a Justice of the Court of Appeal:',
        options: ['The President', 'The Senate', 'The National Judicial Council', 'All of the above'],
        correct: 0, explanation: 'The power of removal lies with the President alone. There are checks on this power: recommendation by the NJC and address of two-thirds majority of the Senate.' },

      // Standalone — Q4–6
      { prompt: 'All but one of the following are things to consider in the appointment of judicial officers:',
        options: ['Year of call', 'Report of the Director of State Services', 'Availability of Courtrooms', 'Number of pro bono cases handled'],
        correct: 3 },
      { prompt: 'Which of the following is a disciplinary measure that can be meted out to erring judicial officers?',
        options: ['Recommendation for dismissal', 'Demotion to a lower court', 'Non-promotion to a higher court for a period of 10 years', 'Non-promotion to a higher court for a period of 5 years'],
        correct: 0, explanation: 'The disciplinary measures against a judicial officer are removal and suspension. The NJC does not have the power of removal, but can only recommend such.' },
      { prompt: 'A complaint against a Judicial Officer can be addressed to:',
        options: ['The Chairman NJC', 'Chief Justice of Nigeria', 'Only A', 'A and B'],
        correct: 3, explanation: 'The CJN is the Chairman of the NJC.' },

      // chiroma-dinner — blanks 1–4 (Q7–10)
      { scenario: 'chiroma-dinner', blank: 1,
        options: ['Minister of the Federal Capital Territory', 'Chief Justice of Nigeria', 'Judicial Service Committee of the FCT', 'President of the Federal Republic of Nigeria'],
        correct: 3, explanation: 'Sec. 255, CFRN.' },
      { scenario: 'chiroma-dinner', blank: 2,
        options: ['Federal Judicial Service Commission', 'Judicial Service Committee of the FCT', 'National Judicial Committee', 'National Judicial Council'],
        correct: 3 },
      { scenario: 'chiroma-dinner', blank: 3,
        options: ['House of Assembly of the FCT', 'House of Representatives', 'The Senate', 'The National Assembly'],
        correct: 2 },
      { scenario: 'chiroma-dinner', blank: 4,
        options: ['The Minister of the Federal Capital Territory', '3/4 majority of the Senate', '2/3 majority of the Senate', '2/3 majority of the National Assembly'],
        correct: 2 },

      // Standalone — Q11
      { prompt: 'One of the following is not a judicial officer:',
        options: ['Kadi of the Sharia Court of Appeal', 'Chief Magistrate of Lagos State', 'Chief Judge of Lagos State', 'None of the above'],
        correct: 1, explanation: 'Magistrates are not judicial officers. Sec. 318, CFRN.' },

      // nic-judges-swearing — blanks 1–5 (Q12–16)
      { scenario: 'nic-judges-swearing', blank: 1,
        options: ['President of the National Industrial Court', 'President of the Federal Republic of Nigeria', 'President of the Court of Appeal', 'Chief Justice of Nigeria'],
        correct: 3 },
      { scenario: 'nic-judges-swearing', blank: 2,
        options: ['Federal Judicial Service Commission', 'National Judicial Council', 'Federal Ministry of Justice', 'Judicial Service Committee of the FCT'],
        correct: 0 },
      { scenario: 'nic-judges-swearing', blank: 3,
        options: ['The Chief Justice of Nigeria', 'The Chief Judge of the High Court of the Federal Capital Territory', 'The Chief Judge of the Federal High Court', 'The Attorney-General of the Federation'],
        correct: 1, explanation: 'Federal Judicial Service Commission, Third Schedule, CFRN.' },
      { scenario: 'nic-judges-swearing', blank: 4,
        options: ['National Judicial Committee', 'The President', 'National Judicial Council', 'Federal Judicial Service Committee'],
        correct: 2 },
      { scenario: 'nic-judges-swearing', blank: 5,
        options: ['The Chief Justice of Nigeria', 'The President of the Federal Republic of Nigeria', 'The Senate', 'The President of the National Industrial Court'],
        correct: 1 },

      // Standalone — Q17–18
      { prompt: 'A non-lawyer is qualified for appointment as a Judicial Officer into one of the following courts:',
        options: ['Customary Court of Appeal', 'Sharia Court of Appeal', 'A and B', 'None of the above'],
        correct: 2, explanation: 'A non-lawyer is qualified for appointment as a judge of the Customary Court of Appeal or Kadi of the Sharia Court of Appeal. See Secs. 261 and 266, CFRN.' },
      { prompt: 'All but one of the following are not judicial officers:',
        options: ['Kadis of the Sharia Court of Appeal', 'Judges of customary courts', 'Chief Magistrates of various courts', 'Judges of Area Courts'],
        correct: 0, explanation: 'Customary Courts, Area Courts and Magistrates\' Courts are not superior courts; judges and magistrates of these courts are not regarded as judicial officers. Sec. 318, CFRN.' },

      // goodboy-appointments — Q19–22
      { scenario: 'goodboy-appointments',
        prompt: 'The only thing wrong in the appointment of Justice Abiola Kalu as CJN is:',
        options: ['The appointment was based on the recommendation of NJC', 'The 15 years post-call', 'The appointment was made by the President of Nigeria', 'None of the above'],
        correct: 3, explanation: 'There is nothing wrong in the appointment. It was made by the President on the recommendation of the NJC, and Justice Abiola has fulfilled the requirement of 15 years post-call.' },
      { scenario: 'goodboy-appointments',
        prompt: 'Which of the following is right concerning the appointment of Justice Idris Abiodun as a Justice of the Supreme Court?',
        options: [
          'The 12 years post-call qualification',
          'The appointment was made by the President',
          'The recommendation was rightly made by the Judicial Service Commission',
          'The House of Representatives making the approval',
        ], correct: 1,
        explanation: 'Appointment of Justices of the Supreme Court is by the President on the recommendation of the NJC and subject to confirmation of the Senate — not the House of Representatives or the National Assembly.' },
      { scenario: 'goodboy-appointments',
        prompt: 'As the Attorney-General of the Federation, which of the following counsel would you have given the President concerning the appointment of Justice Emeka Dawodu as Justice of the Court of Appeal?',
        options: [
          'The post-call qualification ought to be 15 years',
          'The recommendation ought to be by the Judicial Service Committee',
          'The Senate, and not the House of Reps, ought to have approved the appointment',
          'None of the above',
        ], correct: 2 },
      { scenario: 'goodboy-appointments',
        prompt: 'Assuming the appointments above only related to Judges of Abia State High Court, which of the following is true?',
        options: [
          'The President would still have had powers to make the appointment',
          'The recommendation would be made to the Governor by the Abia State Judicial Service Commission',
          'The Abia State House of Assembly would be required to approve all the appointments',
          'None of the above',
        ], correct: 3,
        explanation: 'Appointment of Judges into a State High Court is by the Governor, on the recommendation of the NJC; only the appointment of the Chief Judge is subject to confirmation by the State House of Assembly.' },

      // Standalone — Q23–26
      { prompt: 'The approval of the House of Representatives is required in the case of the appointment of:',
        options: ['Chief Justice of Nigeria', 'Justices of the Supreme Court', 'President of the Court of Appeal', 'None of the above'],
        correct: 3, explanation: 'The House of Representatives is not involved in the appointment of judicial officers; the Senate is.' },
      { prompt: 'The form to be filled for application for appointment as a judicial officer is:',
        options: ['NJC Form A', 'NJC Form I', 'NJC Form 1', 'NJC Form B'], correct: 0 },
      { prompt: 'Recently, upon the death of the incumbent Chief Judge of Imo State, the Governor of the State appointed the most senior Judge to take over the position of the Chief Judge. The appointment was neither based on the recommendation of the appropriate body nor confirmed by the House of Assembly. Your junior colleague from the University is confused as to the validity of the appointment and has met you for guidance. Which of the following is true?',
        options: [
          'The appointment is valid',
          'The appointment is invalid for lack of recommendation by the appropriate body',
          'The appointment is invalid for lack of confirmation by the House of Assembly',
          'B and C',
        ], correct: 0,
        explanation: 'Upon the death of the incumbent Chief Judge of a state, or his inability to perform his duties, the Governor shall appoint the most senior judge of the High Court to perform those functions. Such appointment need not be based on any recommendation nor subject to confirmation by the House of Assembly, but it shall not exceed three months. Sec. 271(4)(5), CFRN.' },
      { prompt: 'All except one are members of the National Judicial Council:',
        options: ['Chief Justice of Nigeria', 'Attorney-General of the Federation', 'Next most senior Justice of the Supreme Court', 'President of the Court of Appeal'],
        correct: 1, explanation: 'The AGF is not a member of the NJC. See the composition of the NJC, Third Schedule, CFRN.' },

      // three-appointments — Q27–30
      { scenario: 'three-appointments',
        prompt: 'Which of the following statements can be said to represent the correct position of the law in the three appointments?',
        options: ['All the appointments are validly made', 'None of the appointments is validly made', 'Only the third appointment is validly made', 'All the appointments except the first were validly made'],
        correct: 1 },
      { scenario: 'three-appointments',
        prompt: 'The only valid thing in the appointment of Justice Wamako is that:',
        options: [
          'The appointment was made by the FCT Minister and confirmed by Senate',
          'The appointment was made on the recommendation of the National Judicial Council and confirmed by the Senate',
          'All actions taken in the appointment were valid',
          'None of the actions taken in the appointment was valid',
        ], correct: 1 },
      { scenario: 'three-appointments',
        prompt: 'Appointment of Justice Agabi is invalid because of one of the following options:',
        options: [
          'He cannot be appointed a Chief Judge while there is an incumbent Chief Judge of the State',
          'The appointment is not invalid',
          'Only because there was no recommendation of the National Judicial Council and no confirmation by the State House of Assembly',
          'Both because the confirmation by the Senate is inappropriate as there was no recommendation to the Senate',
        ], correct: 2 },
      { scenario: 'three-appointments',
        prompt: 'Which of the following is a common requirement of the Constitution for the appointment of Honourable Justices Kotako, Agabi and Wamako?',
        options: [
          'All the appointments are required to be made by the President',
          'All the appointments are required to be confirmed by the Senate',
          'All the appointments are required to be recommended by the National Judicial Committee',
          'All the appointments are required to be recommended by the National Judicial Council',
        ], correct: 3 },

      // Standalone — Q31
      { prompt: 'The total membership of the National Judicial Council according to the Constitution is:',
        options: ['24', '23', '25', '26'],
        correct: 0, explanation: 'Third Schedule, CFRN as amended.' },

      // agba-akin-removal — Q32
      { scenario: 'agba-akin-removal',
        prompt: 'Which of the following is true of the removal of the Chief Judge?',
        options: [
          'It is proper as the House of Assembly has the power to do so on the recommendation of the Governor',
          'It is improper because the power of removal lies with the National Judicial Council acting on the advice of the State Judicial Service Commission',
          'It is improper because the power of removal lies with the President acting on an address of two-thirds majority of the House of Assembly and recommendation of the NJC',
          'It is improper because the power of removal lies with the Governor acting on an address of two-thirds majority of the House of Assembly and recommendation of the NJC',
        ], correct: 3,
        explanation: 'Sec. 292, CFRN. The power of removal of a state judicial officer lies with the Governor. This power must be based on the recommendation of the NJC and, in the case of the Chief Judge, must also be supported by an address of two-thirds majority of the House of Assembly.' },

      // Standalone — Q33
      { prompt: 'A non-lawyer shall be qualified to be appointed a judge of the Customary Court of Appeal of the FCT if:',
        options: [
          'He has considerable knowledge and practice of customary law in the opinion of NJC',
          'He has considerable knowledge and practice of customary law for not less than 10 years in the opinion of NJC',
          'He has considerable knowledge and practice of customary law from a recognised institution approved by NJC',
          'None of the above',
        ], correct: 0 },

      // ─── DISCIPLINE OF LEGAL PRACTITIONERS — Q34–55 ───

      // franklin-onwuegbuchunam-discipline — D2-Q1–6
      { scenario: 'franklin-onwuegbuchunam-discipline',
        prompt: 'All but one of the following can validly receive a complaint brought by Gbedu Bio against Franklin:',
        options: [
          'Presiding Justice of the Court of Appeal Division, Asokoro',
          'Chairman of the Asokoro NBA Branch',
          'Chairman of the Body of Benchers',
          'None of the above',
        ], correct: 3, explanation: 'Regulation 4(1), LPDC Rules, 2020.' },
      { scenario: 'franklin-onwuegbuchunam-discipline',
        prompt: 'The Legal Practitioners Disciplinary Committee has decided to try Franklin for the professional offence(s) committed. Which of the following constitutes proper parties before the Committee?',
        options: ['NBA v Franklin', 'BOB v Franklin', 'LPDC v Franklin', 'Registered Trustees of NBA v Franklin'],
        correct: 3 },
      { scenario: 'franklin-onwuegbuchunam-discipline',
        prompt: 'The standard of proof in LPDC disciplinary proceedings is:',
        options: ['Balance of probabilities', 'Proof beyond reasonable doubt', 'Proof to the satisfaction of the LPDC', 'A and C'],
        correct: 0 },
      { scenario: 'franklin-onwuegbuchunam-discipline',
        prompt: 'The conduct of Franklin against Gbedu Bio would earn him the punishment of:',
        options: ['Suspension', 'Order for return of documents or money by the lawyer', 'Striking off of name from the roll', 'Any of the above'],
        correct: 3 },
      { scenario: 'franklin-onwuegbuchunam-discipline',
        prompt: 'Assuming Franklin was served with the originating application containing the allegations on the 1st of June 2020, if he intends to defend the allegations, he should file an affidavit disclosing a defence not later than:',
        options: ['30th June 2020', '21st June 2020', '24th June 2020', '14th June 2020'],
        correct: 2, explanation: 'The legal practitioner is expected to file his affidavit disclosing evidence within 24 days from the date of service on him. Regulation 10, LPDC Rules, 2020.' },
      { scenario: 'franklin-onwuegbuchunam-discipline',
        prompt: 'The minimum number of days between service of the notice of hearing and the day fixed for hearing by the LPDC is:',
        options: ['14 days', '15 days', '7 days', '5 days'],
        correct: 1, explanation: 'Regulation 12(4), LPDC Rules.' },

      // Standalone — D2-Q7–9
      { prompt: 'The composition of the Legal Practitioners Disciplinary Committee does not include:',
        options: ['The Chief Justice of Nigeria', 'Four members of NBA appointed by the Body of Benchers', 'Chief Judge of the Federal High Court', 'Two Chief Judges'],
        correct: 0, explanation: 'Sec. 11, LPA.' },
      { prompt: 'Appeal against the decision of the LPDC must be filed within how many days of the decision of the Committee, and lies to:',
        options: ['30 days, Supreme Court', '28 days, Appellate Body of the Body of Benchers', '28 days, Supreme Court', '30 days, Appellate Body of the Body of Benchers'],
        correct: 2, explanation: 'Sec. 12(7), LPA.' },
      { prompt: 'The Supreme Court has original jurisdiction to discipline a legal practitioner only for:',
        options: [
          'Infamous conduct in a professional respect in a matter the Supreme Court is seised of only',
          'Professional misconduct committed before the Supreme Court or Court of Appeal by the legal practitioner',
          'Infamous conduct in a professional respect in a matter the Supreme Court is seised of, or matter before any court of record in Nigeria',
          'Professional misconduct committed by the legal practitioner before any court in Nigeria',
        ], correct: 2, explanation: 'Sec. 13(1), LPA.' },

      // john-kobe-arrest — D2-Q10–11
      { scenario: 'john-kobe-arrest',
        prompt: 'All the following except one have disciplinary powers over legal practitioners:',
        options: ['Legal Practitioners Disciplinary Committee', 'The Chief Registrar of the Supreme Court', 'The Chief Justice of Nigeria', 'None of the above'],
        correct: 1, explanation: 'The Chief Registrar of the Supreme Court does not have disciplinary powers over legal practitioners. He can only act upon the order of the LPDC or the Supreme Court.' },
      { scenario: 'john-kobe-arrest',
        prompt: "Which of the following is true of the Chief Registrar's action to strike the name of a legal practitioner off the roll?",
        options: [
          'It can be exercised upon the order of the LPDC',
          'It can be exercised upon the order of the Chief Justice of Nigeria',
          'It can be exercised unilaterally by the Chief Registrar of the Supreme Court',
          'A and B',
        ], correct: 0, explanation: "The CJN's power to discipline a legal practitioner is limited to suspension. Only the Supreme Court and the LPDC can order the name of a legal practitioner be struck off the roll." },

      // Standalone — D2-Q12–16
      { prompt: 'A legal practitioner may be disciplined in respect of all the following except:',
        options: [
          'Infamous conduct in a professional respect',
          'Conviction by any court anywhere',
          'Obtaining enrolment by fraud',
          'Conducts which are incompatible with the status of a legal practitioner',
        ], correct: 1, explanation: 'The conviction has to be by a court having power to award imprisonment in Nigeria. Sec. 11(1)(b), LPA.' },
      { prompt: 'Conviction by any court having power to award imprisonment for an offence (whether or not punishable with imprisonment) is one of the professional offences mentioned in the Legal Practitioners Act. The LPDC puts the following into consideration in its determination of this offence except:',
        options: ['The location where the case was heard', 'The seriousness of the offence', 'Whether or not an appeal is pending', 'None of the above'],
        correct: 1, explanation: 'Per the source answer key. (Note: the source\'s explanation states that "LPDC puts all the options into consideration" — which would make D the answer. The source\'s printed letter is preserved here; see the Guardrails section.)' },
      { prompt: "The 'Legal Practitioners Disciplinary Committee Rules' was made by:",
        options: ['The Attorney General of the Federation', 'The President of the Court of Appeal', 'The Chief Justice of Nigeria', 'The National Assembly'],
        correct: 2, explanation: 'Section 10(7), LPA.' },
      { prompt: 'The decision of the LPDC is appropriately referred to as:',
        options: ['Judgment', 'Direction', 'Award', 'Ruling'], correct: 1 },
      { prompt: 'Which of the following is incorrect about an infamous conduct in a professional respect?',
        options: [
          'Infamous conduct in a professional respect is a conduct which brings only the legal practitioner to public ridicule',
          'It is a conduct which belittles and disparages the legal practitioner in the estimation of right-thinking men in the society',
          'It is a scandalous and disgraceful conduct unbecoming of a person who belongs to the honourable legal profession',
          'It reduces the reputation of the profession in the estimation of right-thinking men of the society',
        ], correct: 0, explanation: 'Infamous conduct affects the profession, not just the legal practitioner involved. Allison v General Council of Medical Education.' },

      // denton-momoh-discipline — D2-Q17–18
      { scenario: 'denton-momoh-discipline',
        prompt: 'The alleged acts of Momoh Daudu can appropriately be described as:',
        options: ['Obtaining by false pretence', 'Infamous conduct in a professional respect', 'Conduct unbecoming of the status of a legal practitioner', 'B and C'],
        correct: 3 },
      { scenario: 'denton-momoh-discipline',
        prompt: 'Assuming the LPDC gives a direction for the refund of the embezzled money to the client, within how many days must Momoh Daudu comply with the direction?',
        options: ['1 month', '30 days', '28 days', '2 months'],
        correct: 2, explanation: 'Section 12(9), LPA.' },

      // Standalone — D2-Q19
      { prompt: 'Where a legal practitioner is guilty of misconduct, though not infamous, but which is incompatible with the status of a legal practitioner, the punishment that can be meted out includes all but one of the following:',
        options: ['Suspension from practice for a certain period', 'Striking his name off the roll of legal practitioners', 'Admonition', 'None of the above'],
        correct: 1, explanation: 'Sec. 12(2), LPA. Where a legal practitioner is guilty of misconduct not amounting to infamous conduct, the LPDC may suspend or admonish him, but not order that his name be struck off the roll.' },

      // kevin-mike-oba — D2-Q20–21
      { scenario: 'kevin-mike-oba',
        prompt: 'What offence has Mike Oba committed?',
        options: ['Obtaining enrolment by fraud', 'Conduct incompatible with his status', 'Infamous conduct but not in a professional respect', 'None of the above'],
        correct: 3, explanation: 'Mike Oba is not a legal practitioner, thus he cannot be guilty of any of the professional offences.' },
      { scenario: 'kevin-mike-oba',
        prompt: 'On the authority of Garba v University of Maiduguri:',
        options: [
          'Kevin Oba must be expelled by NBA',
          "LPDC must strike out Mike Oba's name from the roll",
          'Kevin Oba will be admonished',
          'Kevin Oba will be prosecuted for LPDC to discipline him',
        ], correct: 3, explanation: 'Where prosecuted before the LPDC, he will be given the right to be heard.' },

      // Standalone — D2-Q22
      { prompt: 'Only one of the following is incorrect of the disciplinary power of the Chief Justice of Nigeria:',
        options: [
          'It covers all the punishments',
          'It is restricted to suspension of the legal practitioner',
          'It can be exercised while proceedings before the LPDC are pending',
          'The fact that an appeal is pending against a conviction does not affect its exercise',
        ], correct: 0, explanation: 'The disciplinary power of the CJN does not cover all the punishments. The CJN does not have the power to order that the name of a legal practitioner be struck off the roll. Sec. 13(2), LPA.' },
    ],
  },
  {
    courseId: 1,
    topicName: 'WK 9: Basic Drafting Principles and Stages of Drafting',
    scenarios: [
      {
        key: 'coode-analysis',
        text: 'Where {{1}}, if he applies to the law school, the {{2}} may admit him to the law school.',
      },
    ],
    questions: [
      { prompt: 'Habits to avoid when drafting (except one):', options: ['Use of archaic words', 'Use of uncommon words', 'Being precise', 'Use of Latin maxims'], correct: 2, explanation: 'Being precise is a habit to embrace.' },
      { prompt: 'George Coode: every legislative sentence has how many parts?', options: ['3', '4', '5', '6'], correct: 1, explanation: 'George Coode identified four parts of a legislative sentence.' },
      { scenario: 'coode-analysis', blank: 1, options: ['Case', 'Condition', 'Legal action', 'Legal subject'], correct: 0, explanation: 'The phrase "Where any person has obtained a degree in law" sets out the case or circumstance.' },
      { scenario: 'coode-analysis', blank: 2, options: ['Legal object', 'Legal actor', 'Case', 'Legal subject'], correct: 3, explanation: 'The Council of Legal Education is the legal subject.' },
      { prompt: 'Types of paragraphing techniques:', options: ['2', '3', '4', '5'], correct: 0, explanation: 'There are two types of paragraphing techniques.' },
      { prompt: "Three-layered paragraph example: 'If an applicant: a. has attained the age of 21 years b. has completed six months service c. agrees to be bound by this Trust Deed, he may be accepted as a member.' What type?", options: ['One layered', 'Two layered', 'Three layered', 'Four layered'], correct: 2, explanation: 'This is a three-layered paragraph.' },
      { prompt: 'Lease commencement from 1st May 2020 - effective date?', options: ['1st May', '2nd May', '3rd May', 'Any day'], correct: 1, explanation: "The word 'from' is exclusive, so the effective date is 2nd May." },
      { prompt: "Letter marked 'confidential' - NOT an implication:", options: ['Confined to law firm', 'Secretary can open', 'Only managing partner can open', 'None'], correct: 2, explanation: 'Confidential means the secretary can open it, so the implication that only managing partner can open is NOT correct.' },
      { prompt: "Letterhead should contain all EXCEPT:", options: ["Space for client's name", 'Space for date', "Firm's name and address", 'Names of practitioners'], correct: 0, explanation: "Letterhead does not need space for client's name." },
      { prompt: "'Without prejudice' inscription - all but one:", options: ['Cannot be tendered', 'Parties waived rights', "Writer's position not jeopardized", 'None'], correct: 1, explanation: 'The inscription does not mean parties waived rights.' },
      { prompt: 'Letter confirming instructions:', options: ['Status letter', 'Opinion letter', 'Demand letter', 'Confirming letter'], correct: 3, explanation: 'It is a confirming letter.' },
      { prompt: "'Dear Mr. Johnson' salutation - best close:", options: ['Yours faithfully', 'Yours affectionately', 'Yours truly', 'Yours sincerely'], correct: 3, explanation: 'Yours sincerely is used with a name.' },
      { prompt: "'In attendance' in minutes:", options: ['Members present', 'Members absent with apologies', 'Members by proxies', 'Invited persons other than members present'], correct: 3, explanation: 'In attendance refers to invited persons other than members present.' },
      { prompt: 'Part of minutes EXCEPT:', options: ['Heading and list present', 'Adoption of previous minutes', 'Resolution on refreshment', 'Matters arising'], correct: 2, explanation: 'Resolution on refreshment is not a standard part of minutes.' },
      { prompt: 'Part capturing main themes of legislation:', options: ['Short title', 'Long title', 'Preamble', 'Commencement clause'], correct: 1, explanation: 'The long title captures the main themes.' },
      { prompt: 'Section/subsection/paragraph/subparagraph writing:', options: ['S. 1(1)(a)(i)(B)', 'S. 1(1)(A)(i)(a)', 'S. 1(1)(A)(I)(B)', 'None'], correct: 0, explanation: 'The correct format is S. 1(1)(a)(i)(B).' },
      { prompt: 'Nickname of a statute:', options: ['Marginal note', 'Short title', 'Schedule', 'Preamble'], correct: 1, explanation: 'The short title is the nickname.' },
      { prompt: 'Which forms part of legislation:', options: ['Long title', 'Marginal notes', 'All', 'None'], correct: 0, explanation: 'The long title is part of legislation, marginal notes are not.' },
      { prompt: 'Part dealing with establishing statutory body:', options: ['Enacting formula', 'Creating clause', 'Establishment clause', 'Founding clause'], correct: 2, explanation: 'The establishment clause deals with establishing statutory bodies.' },
      { prompt: "'The law may be cited as...' = beginning of:", options: ['Short title', 'Long title', 'Preamble', 'Marginal notes'], correct: 0, explanation: 'This is the beginning of the short title.' },
      { prompt: 'Stages of preparing Bill:', options: ['Taking, designing, analyzing, composing, scrutiny', 'Taking, composing, designing, analyzing, scrutiny', 'Taking, designing, composing, analyzing, scrutiny', 'Taking, analyzing, designing, composing, scrutiny'], correct: 3, explanation: 'The correct order is taking, analyzing, designing, composing, scrutiny.' },
      { prompt: 'Stage consulting existing laws:', options: ['Strategic', 'Designing', 'Analysis', 'Scrutiny'], correct: 2, explanation: 'Analysis involves consulting existing laws.' },
      { prompt: 'Proposed long title:', options: ['A BILL FOR AN ACT TO MITIGATE THE HARSHNESS OF ECONOMIC HARDSHIP OF NIGERIANS DURING PERIODS OF PANDEMIC AND OTHER RELATED MATTERS', 'AN ACT TO MITIGATE...', 'A BILL FOR A LAW TO MITIGATE...', 'A LAW TO MITIGATE...'], correct: 0, explanation: "The proposed long title starts with 'A BILL FOR AN ACT TO...'." },
      { prompt: "Restrictive meaning of 'pandemic':", options: ['Means', 'Includes', 'Comprises', 'Covers'], correct: 0, explanation: "'Means' gives a restrictive meaning." },
      { prompt: 'Duty NOT owed to client:', options: ['Interest of client as absolute', 'Represent competently', 'Devotion and dedication', 'All'], correct: 0, explanation: 'The interest of the client is not absolute.' },
      { prompt: 'Long title falls under:', options: ['Principal part', 'Miscellaneous part', 'Preliminary part', 'Final part'], correct: 2, explanation: 'The long title is part of the preliminary part.' },
      { prompt: 'NOT stages of legislative process:', options: ['Taking instructions', 'Analysing instructions', 'First reading', 'Designing draft'], correct: 2, explanation: 'First reading is not a stage of legislative drafting.' },
      { prompt: 'End product of legislative drafting:', options: ['Treaty', 'Act', 'Law', 'Bill'], correct: 3, explanation: 'The end product is a Bill.' },
      { prompt: 'Example of long title:', options: ['This Act may be cited as...', 'An act to amend...', 'Enacted by the National Assembly...', 'We the people...'], correct: 1, explanation: 'An act to amend... is a long title.' },
      { prompt: 'Ways Act may come into existence EXCEPT:', options: ['By date stated', 'By Assent/publication', 'By authorising named person', 'None'], correct: 3, explanation: 'None of the above is correct.' },
      { prompt: 'Proper order of Bill:', options: ['Long title, commencement, short title, enacting clause, interpretation', 'Commencement, long title, short title, enacting clause, interpretation', 'Long title, commencement, enacting clause, interpretation section, short title', 'None'], correct: 2, explanation: 'The proper order is long title, commencement, enacting clause, interpretation section, short title.' },
    ],
  },
  {
    courseId: 1,
    topicName: 'Wk 11: Improper attraction of business and interviewing and counseling skills',
    scenarios: [
      {
        key: 'jozech-interview',
        text: 'Jozech Franklin, an associate in the law firm of Babalaakin and Co. was sent by his supervisor to conduct a client interview with a new client at the client\'s house because of the status of the client in the society as the branch manager of Access Bank PLC, Maitama Abuja, Mr. Olowoeyo.',
      },
    ],
    questions: [
      { prompt: 'Objectives of initial client interview EXCEPT:', options: ['Ascertain why client requires lawyer', 'Form lawyer-client relationship', 'Learn goals of client', 'Impress client with knowledge'], correct: 3, explanation: 'Impressing the client with knowledge is not an objective of an initial client interview.' },
      { scenario: 'jozech-interview', prompt: 'Going to client\'s house = breach of which RPC rule?', options: ['Rule 22', 'Rule 21', 'Rule 18', 'Rule 24'], correct: 0, explanation: 'Going to the client\'s house breaches Rule 22 of the RPC.' },
      { prompt: 'Interview procedure:', options: ['Questioning, listening, advising', 'Listening, advising, questioning', 'Listening, questioning, advising', 'Listening, questioning, further listening'], correct: 2, explanation: 'The correct order is listening, questioning, advising.' },
      { prompt: 'Ethical issues EXCEPT:', options: ['Advise within bound of law', 'Assure client of success', 'Preserve confidential info', 'None'], correct: 1, explanation: 'A lawyer must not assure a client of success.' },
      { prompt: 'Avrom Sherr\'s model stages:', options: ['Three', 'Four', 'Five', 'Six'], correct: 0, explanation: 'Avrom Sherr\'s model has three stages.' },
      { prompt: 'Avrom Sherr\'s stages:', options: ['Listening, Questioning, Understanding, Advising', 'Listening, Understanding, Questioning, Advising', 'Questioning, Listening, Advising', 'Listening, Questioning, Advising'], correct: 3, explanation: 'The three stages are listening, questioning, and advising.' },
      { prompt: 'Touting example:', options: ['Publishing in law directory', 'Frequently going to clubs/hotels/restaurants to distribute cards', 'Participating in radio/TV programs', 'None'], correct: 1, explanation: 'Frequently going to clubs, hotels, and restaurants to distribute cards constitutes touting.' },
      { prompt: 'Lawyer may wear robes EXCEPT:', options: ['As directed by Bar Council', 'Conducting own case as party', 'Giving evidence in court', 'Attending church procession'], correct: 3, explanation: 'A lawyer may not wear robes when attending a church procession.' },
      { prompt: 'Law directory contents EXCEPT:', options: ['Date/place of birth and admission', 'Public office, post of honour, legal authorship', 'Legal teaching position', 'Highest amount earned from case'], correct: 3, explanation: 'The law directory does not include the highest amount earned from a case.' },
      { prompt: 'Lawyer shall not proffer advice to bring lawsuit EXCEPT:', options: ['Female accident victim', 'Pregnant woman', 'Victim of fraud', 'Sibling'], correct: 3, explanation: 'A lawyer may proffer advice to a sibling to bring a lawsuit.' },
      { prompt: 'Reasonable advertisements EXCEPT:', options: ['Signs and notices', 'Fliers and billboards', 'Books and articles', 'Notepapers and envelopes'], correct: 1, explanation: 'Fliers and billboards are not considered reasonable advertisements.' },
      { prompt: 'RPC absolutely prohibits:', options: ['Advertisement', 'Solicitation for professional job', 'Holding brief for another counsel', 'None'], correct: 1, explanation: 'The RPC absolutely prohibits solicitation for professional job.' },
      { prompt: 'Rule for advertisement:', options: ['Rule 37', 'Rule 38', 'Rule 35', 'Rule 39'], correct: 3, explanation: 'Rule 39 governs advertisement.' },
      { prompt: 'Barrister Momoh permitted inspiring sound recording - breached rule:', options: ['Rule 39(3)', 'Rule 40(2)', 'Rule 39(3)(d)', 'Rule 39(4)(b)'], correct: 2, explanation: 'Barrister Momoh breached Rule 39(3)(d).' },
      { prompt: 'Advertisement approval criteria EXCEPT:', options: ['Fair and proper', 'Reasonable and sober design', 'Complies with rules', 'Frequent and obstructive'], correct: 3, explanation: 'Frequent and obstructive is not an approval criterion.' },
      { prompt: 'Mr. Jaguda employed Titilope to lookout for new companies - breached rule:', options: ['Rule 47(2)(d)', 'Rule 39(1)', 'Rule 45', 'Rule 46(3)'], correct: 0, explanation: 'Mr. Jaguda breached Rule 47(2)(d).' },
    ],
  },
  {
    courseId: 1,
    topicName: 'Wk 12: Legal Research, use of AI in legal research and closing of files',
    scenarios: [
      {
        key: 'world-class-research',
        text: 'During your externship with the Law firm of World Class LP in Lagos Nigeria, you were given the task of conducting extensive legal research on certain issues.',
      },
    ],
    questions: [
      { prompt: 'Functions of legal research EXCEPT:', options: ['Acquainted with current law', 'Determine best approach', 'Prepare for trial by getting details', 'None'], correct: 3, explanation: 'All listed are functions of legal research.' },
      { prompt: 'Source to make court bound to follow reasoning:', options: ['Primary', 'Secondary', 'Hybrid', 'Tertiary'], correct: 0, explanation: 'Primary sources bind courts to follow their reasoning.' },
      { prompt: 'NOT a secondary source:', options: ['Nigerian Commercial Law by M.C. Okany', "Black's Law Dictionary", 'Nigerian Law and Practice Journal', 'Nigerian Weekly Law Report'], correct: 3, explanation: 'Nigerian Weekly Law Report is a primary source, not secondary.' },
      { prompt: 'NOT a class of legal literature:', options: ['Original source', 'Secondary source', 'Primary source', 'Tertiary source'], correct: 0, explanation: 'Original source is not a standard class of legal literature.' },
      { prompt: 'Examples of primary sources EXCEPT:', options: ['Laws of Federation', 'Practical approach to criminal litigation', 'Laws of various states', 'Criminal code'], correct: 1, explanation: 'Practical approach to criminal litigation is a secondary source.' },
      { prompt: 'Hints for effective legal research EXCEPT:', options: ['Good electronic/manual library', 'Effective research assistant', 'Aversion for consulting expert colleagues', 'Collaboration with court officials'], correct: 2, explanation: 'Aversion for consulting expert colleagues is not a hint for effective research.' },
      { prompt: "What to do to case file after handling client's case:", options: ['Close the file', 'Return the file', 'Archive the file', 'None'], correct: 0, explanation: 'The file should be closed after handling the client\'s case.' },
      { prompt: 'Matters dealt with when closing file EXCEPT:', options: ['Client interview', 'Custody of documents', 'Self assessment/audit', 'Fees'], correct: 0, explanation: 'Client interview is not dealt with when closing a file.' },
      { prompt: 'Statutory period for keeping closed files:', options: ['6 years', '3 years', '4 years', 'None'], correct: 3, explanation: 'There is no statutory period for keeping closed files.' },
      { prompt: 'Case file bearing name, suit number is property of:', options: ['The State', 'The Client', 'The Law Firm', 'The Counsel'], correct: 1, explanation: 'The case file is the property of the client.' },
    ],
  },
  {
    courseId: 1,
    topicName: 'Wk 13: Arbitration I : Negotiation, conciliation, mediation, online ADR',
    scenarios: [ 
      { key: 'chief-kola-adr', text: 'You have been approached by Chief Kola Johnson to institute an action against Goodside Nigeria Limited for damage as a result of negligence caused to his car.' },
      { key: 'arbitration-contract', text: 'On June 24, 2019, Barrister Inusa Obed signed a contract on behalf of his client, Edokpolo Obiosa with Council of Legal Education for the renovation of the Bayelsa campus of the Nigerian Law School. The agreement contains an arbitration clause that in the event of dispute, parties are to resort first to a three man Arbitral panel.' },
    ],
    questions: [
      { scenario: 'chief-kola-adr', blank: 1, options: ['File action immediately', 'Advise client on ADR option', 'Reject brief', 'None'], correct: 1, explanation: 'The first thing to do by RPC is to advise client on ADR option.' },
      { prompt: 'Authority for the above answer:', options: ['Rule 15 RPC', 'Rule 15(3)(d)', 'Rule 15(3)', 'Rule 15(2)'], correct: 1, explanation: 'Rule 15(3)(d) of the RPC.' },
      { prompt: 'Non-arbitral matters EXCEPT:', options: ['Election petition', 'Validity of a Will', 'Breach of contract', 'Criminal matters'], correct: 2, explanation: 'Breach of contract is not a non-arbitral matter.' },
      { prompt: 'ADR mechanisms involving third party EXCEPT:', options: ['Mediation', 'Negotiation', 'Arbitration', 'Conciliation'], correct: 1, explanation: 'Negotiation does not involve a third party.' },
      { prompt: 'Neutral third party who helps parties resolve differences:', options: ['Mediation', 'Conciliation', 'Arbitration', 'Negotiation'], correct: 0, explanation: 'Mediation involves a neutral third party helping parties resolve differences.' },
      { prompt: 'Four stages of negotiation EXCEPT:', options: ['Meet and Greet', 'Bargaining', 'Closing', 'Execution'], correct: 0, explanation: 'Meet and Greet is not one of the four stages of negotiation.' },
      { prompt: 'Negotiating issues one by one instead of together:', options: ['Hit and run', 'Puff', 'Win-win', 'Nibble'], correct: 3, explanation: 'Nibble is the tactic of negotiating issues one by one.' },
      { prompt: 'Party whose goal is to win no matter what:', options: ['Win or lose approach', 'Competitive approach', 'Positional approach', 'All of the above'], correct: 3, explanation: 'All of these approaches aim to win no matter what.' },
      { prompt: 'ADR mechanism regulated by law:', options: ['Arbitration', 'Mediation', 'Conciliation', 'A and C'], correct: 3, explanation: 'Both Arbitration and Conciliation are regulated by law.' },
      { prompt: 'Under Section 4 ACA 2004, party commences court action without recourse to arbitration:', options: ['Clause deemed waived', 'Other party can apply for stay of proceedings', 'Other party can apply for stay of execution', 'Court should dismiss'], correct: 1, explanation: 'The other party can apply for stay of proceedings.' },
      { scenario: 'arbitration-contract', prompt: 'Arbitration can arise from EXCEPT:', options: ['Agreement of parties', 'By statute', 'By order of court', 'None'], correct: 3, explanation: 'Arbitration can arise from agreement, statute, or court order, so none is the exception.' },
      { prompt: 'Arbitration clause characteristics EXCEPT:', options: ['Where main contract failed, clause still stands', 'Ex facie illegality of contract does not affect it', 'Independent of contract', 'Death of either party does not affect it'], correct: 1, explanation: 'Ex facie illegality of contract does affect the arbitration clause.' },
      { scenario: 'arbitration-contract', prompt: 'Council may succeed in arbitration application only if:', options: ['Filed statement of defence', 'Filed memorandum of appearance', 'Has not taken any step', 'Is represented by lawyer'], correct: 2, explanation: 'The Council may succeed if it has not taken any step in the proceedings.' },
      { scenario: 'arbitration-contract', prompt: 'Arbitral award can be enforced by:', options: ['Motion Ex parte', 'Motion on Notice', 'Originating Summons', 'Originating Motion'], correct: 1, explanation: 'An arbitral award can be enforced by Motion on Notice.' },
      { prompt: 'Time limit to challenge award:', options: ['3 months', '2 months', '60 days', '90 days'], correct: 0, explanation: 'The time limit to challenge an award is 3 months.' },
      { prompt: 'Application to challenge award is by:', options: ['Notice to challenge', 'Proceeding in lieu of demurrer', 'Motion on notice', 'Originating summons'], correct: 2, explanation: 'Application to challenge award is by Motion on notice.' },
      { prompt: 'Negotiating tactics EXCEPT:', options: ['Control of agenda', 'Contextual manipulation', 'Nibble', 'Problem solving'], correct: 1, explanation: 'Contextual manipulation is not a negotiating tactic.' },
      { prompt: 'Arbitration differs from negotiation because arbitral process is:', options: ['Binding and enforceable in court', 'Involves only four persons', 'Presided by High Court judge', 'Lawyers do not appear'], correct: 0, explanation: 'Arbitration is binding and enforceable in court, unlike negotiation.' },
      { prompt: 'WATNA acronym:', options: ['Worst Attempts To Negotiated Agreement', 'Ways To Negotiate Agreement', 'Worst Avenues To Negotiate Agreement', 'Worst Alternative to Negotiated Agreement'], correct: 3, explanation: 'WATNA stands for Worst Alternative to Negotiated Agreement.' },
      { prompt: 'Neutral third party who merely suggests solutions:', options: ['Conciliation', 'Mediation', 'Arbitration', 'Negotiation'], correct: 0, explanation: 'Conciliation involves a neutral third party who merely suggests solutions.' },
    ],
  },
  {
    courseId: 1,
    topicName: 'Wk 15: Law office Management, use of ICT in law office management and Lagos multi door court house',
    scenarios: [ 
      { key: 'bobo-ajasco', text: 'Bobo Ajasco was called to the Nigerian Bar in 2019. He graduated with a second class lower both at the University and the Nigerian Law School, as a result of which he could not secure a meaningful paid employment with any law firm. Having shuffled from one job to the other with no increase in payment from the ₦20,000 he started with in his first job, he has decided to take the bold step to set up his own law office. He intends to get the capital from a loan with First Bank PLC.' },
      { key: 'badmus-office', text: 'Mr. Opeyemi Badmus was called to the Nigerian Bar in October 2018. During his call to bar ceremony, one of his uncles gave him the sum of ₦5,000,000 (five million naira only) to establish his own office and commence his legal career. He set up his office as Badmus Opeyemi LP in Industrial Avenue, Ilupeju, Lagos State. He decided to call two of his friends from school who were called to the Nigerian Bar in 2019 to work for him. He also employed a cleaner and a secretary.' },
      { key: 'eric-ebute', text: 'Eric Ebute was among the last batch of legal practitioners that were called to the Nigerian Bar in October, 2018. Before his call, his father had built a storey building for him to use as his office. He employed another Lawyer and a Secretary, both of whom he pays salary. Due to the location of the Law office, clientele base is very low and he is considering renting a new premises in another location.' },
      { key: 'bubu-shinzu', text: 'Mr. Bubu Shinzu, a young wig, of one year experience at the Bar has his own office and practices alone as a sole proprietorship. Right from his University days, he has always asserted that he would never work for any lawyer and earn peanuts; rather, other lawyers would work for him. In setting up his office and establishing his practice, he obtained a loan from First Bank Nigeria PLC using the property he inherited from his father as security for the loan. He has as his employees 5 other lawyers, a clerk, a secretary and a driver.' },
      { key: 'taiwo-uche', text: 'Taiwo Ahmed and Uche Alaba were called to the Nigerian Bar on July 6, 2017. Immediately after their call, they decided to start practicing. In order to actualize the objective, they pooled resources together and rented an office space which was partitioned into two offices and a reception. Each of them has a separate practice but shared one Secretary.' },
      { key: 'ajayi-benjamin', text: 'Mr. Ajayi Benjamin is the Principal Counsel at Ajayi Legal Counsel in Ogbomoso, Oyo State. It is a very busy law office. Mr. Ajayi has employed 8 young and vibrant lawyers to work with him. During your just concluded externship programme, 5 students of the Nigerian Law School were posted there.' },
    ],
    questions: [
      { scenario: 'bobo-ajasco', prompt: 'Reasons for setting up law office EXCEPT:', options: ['Lack of paid employment', 'Pride or self esteem', 'Compliance with RPC', 'None'], correct: 3, explanation: 'None is the exception as it is not a reason for setting up a law office.' },
      { prompt: 'Statutory post-call period before setting up office:', options: ['5 years', '1 year', '2 years', 'None'], correct: 3, explanation: 'There is no statutory post-call period before setting up an office.' },
      { prompt: 'Notification to NBA branch within:', options: ['31 July 2020', '31 August 2020', '15 July 2020', '29 July 2020'], correct: 0, explanation: 'Notification must be within 31 July 2020.' },
      { prompt: 'Contents of Notice EXCEPT:', options: ['Name', 'Grade from Law School', 'Office address', 'Date enrolled'], correct: 1, explanation: 'Grade from Law School is not a required content of the notice.' },
      { scenario: 'badmus-office', prompt: 'Badmus practice:', options: ['Only fee earner', 'Four fee earners', 'Two fee earners', 'Four supporting staff'], correct: 2, explanation: 'Badmus has two fee earners: himself and two friends, but the question says two fee earners.' },
      { prompt: 'Factors NOT considered for premises EXCEPT:', options: ['Size of premises', 'Compatibility of businesses', 'Proximity to NBA headquarters', 'Proximity to courts/clients'], correct: 2, explanation: 'Proximity to NBA headquarters is not a factor considered for premises.' },
      { prompt: 'Basic skills NOT required:', options: ['Programming skills', 'Interview skills', 'Advocacy skills', 'Communication skills'], correct: 0, explanation: 'Programming skills are not required for a law office.' },
      { scenario: 'badmus-office', prompt: 'Type of practice:', options: ['Sole practitionership', 'Partnership', 'Sole proprietorship', 'Associateship'], correct: 2, explanation: 'Badmus set up as a sole proprietorship.' },
      { prompt: 'Advantage NOT of sole proprietorship:', options: ['Easy to set up', 'Absence of slow decision making', 'Concentration of credit', 'Absence of specialisation'], correct: 3, explanation: 'Absence of specialisation is not an advantage; it is a disadvantage.' },
      { prompt: 'Need to succeed EXCEPT:', options: ['Good luck', 'Handsomeness', 'Knowledge', 'Experience'], correct: 1, explanation: 'Handsomeness is not needed to succeed in law practice.' },
      { scenario: 'eric-ebute', prompt: 'Type of premises:', options: ['Office in the home', 'Rented office', 'Purpose built office', 'Existing building'], correct: 2, explanation: 'Eric has a purpose built office.' },
      { prompt: 'NOT a method to search for office:', options: ['Search at land registries', 'Personal scouting', 'Placing adverts', 'Use of estate agents'], correct: 0, explanation: 'Searching at land registries is not a method to search for office space.' },
      { prompt: 'Accounts to keep EXCEPT:', options: ['Personal Account', 'Trust Account', "Client's Account", 'Equity Account'], correct: 3, explanation: 'Equity Account is not an account that must be kept.' },
      { scenario: 'bubu-shinzu', prompt: 'Sole proprietor means:', options: ['Only fee earner', 'Employs fee earners', 'Only fee earner but employs support staff', 'None'], correct: 1, explanation: 'A sole proprietor can employ fee earners.' },
      { scenario: 'bubu-shinzu', prompt: 'Fee earners count:', options: ['Five', 'Six', 'Three', 'Eight'], correct: 0, explanation: 'Bubu has 5 other lawyers as fee earners.' },
      { scenario: 'bubu-shinzu', prompt: 'Office classification:', options: ['Small', 'Low size', 'Medium', 'Large'], correct: 2, explanation: 'With 5 lawyers, it is classified as medium.' },
      { scenario: 'taiwo-uche', prompt: 'Capital raised through EXCEPT:', options: ['Personal savings', 'Loan', 'Gifts from relatives', 'None'], correct: 3, explanation: 'They pooled resources, which could be personal savings, loans, or gifts, so none is the exception.' },
      { scenario: 'taiwo-uche', prompt: 'Type of practice:', options: ['Partnership', 'Sole proprietorship', 'Associateship', 'Sole practitionerships'], correct: 2, explanation: 'They have separate practices but shared secretary, which is associateship.' },
      { prompt: 'Office equipment necessary EXCEPT:', options: ['Generator', 'Computer', 'Printer', 'Photocopier'], correct: 0, explanation: 'Generator is not absolutely necessary, though common in Nigeria.' },
      { prompt: 'Utility bills, salaries, stationery =:', options: ['Start-up capital', 'Capital expenditure', 'Assets and expenditure', 'Working capital'], correct: 3, explanation: 'These are part of working capital.' },
      { prompt: 'Partnership primarily because:', options: ['All partners close friends', 'Established by 2+ practitioners who share vision and contributed capital', 'They have a deed', 'All'], correct: 1, explanation: 'Partnership is established by two or more practitioners who share vision and contribute capital.' },
      { prompt: 'Different from partnership where practitioners manage independent practices:', options: ['Sole proprietorship', 'Sole Associateship', 'Sole practitionerships', 'Associateship'], correct: 3, explanation: 'Associateship is where practitioners manage independent practices but share some resources.' },
      { prompt: 'Partnership advantage EXCEPT:', options: ['Partners liable for acts of others', 'Financial responsibility shared', 'Loss and risk shared', 'Easier to attract clients'], correct: 0, explanation: 'Partners being liable for acts of others is a disadvantage, not an advantage.' },
      { prompt: 'Partners sought funding from EXCEPT:', options: ['Bank loans', 'Money from relatives/friends', 'Application to Remuneration Committee', 'Personal savings'], correct: 2, explanation: 'Application to Remuneration Committee is not a source of funding for partners.' },
      { prompt: 'Statutes, law reports, regulations, bye laws =:', options: ['Primary sources', 'Secondary sources', 'Tertiary sources', 'Universal sources'], correct: 0, explanation: 'These are primary sources of law.' },
      { prompt: 'Hard copy and ___ versions:', options: ['Book', 'Journal', 'Electronic', 'Compact disc'], correct: 2, explanation: 'Hard copy and electronic versions.' },
      { prompt: 'Challenges to ICT EXCEPT:', options: ['High cost of IT machines', 'Conservative nature of legal profession', 'High rate of internet fraud', 'Lack of constant electricity'], correct: 1, explanation: 'Conservative nature is not a challenge to ICT but a barrier to adoption.' },
      { prompt: 'NOT criteria for classification:', options: ['Location', 'Capital base', 'Facilities', 'Number of Lawyers'], correct: 1, explanation: 'Capital base is not a criteria for classification of law offices.' },
      { scenario: 'ajayi-benjamin', prompt: 'Essential item:', options: ['Personal diary', 'Personal calendar', 'Office diary', 'Office calendar'], correct: 2, explanation: 'Office diary is essential for a law office.' },
      { prompt: 'Mandatory under RPC:', options: ["Client's account", 'Four room office', 'Current account for salaried lawyers', 'All'], correct: 0, explanation: "Client's account is mandatory under the RPC." },
      { prompt: 'Important office machines EXCEPT:', options: ['Photocopying machine', 'Generator', 'Vehicles', 'None'], correct: 0, explanation: 'Photocopying machine is not considered an important office machine in this context.' },
      { prompt: 'NOT a method to acquire machines:', options: ['Mortgage', 'Leasing', 'Purchasing', 'None'], correct: 0, explanation: 'Mortgage is not a method to acquire machines; it is for property.' },
      { prompt: 'Management by select group:', options: ['Sole partner', 'All partners', 'Committee of partners', 'Experts'], correct: 2, explanation: 'Management by a committee of partners.' },
      { prompt: 'NOT true of Associateship:', options: ['Associate takes full credit', 'Associates have same and not independent practice', 'Associate has difficulty attracting clients', 'Death of Associate entails death of practice'], correct: 1, explanation: 'Associates have independent practices, so this is not true.' },
      { prompt: 'NOT a law office supply:', options: ['File Jacket', 'Rubber stamp', 'Business cards', 'Letter head'], correct: 1, explanation: 'Rubber stamp is not considered a law office supply.' },
    ],
  },
  {
    courseId: 1,
    topicName: 'Contempt of Court',
    scenarios: [
      { key: 'alex-victor-court', text: 'The following scenario played out in court during one of your visits there as an observer.\n\nAlex Victor: My lord, since the ruling of this Court ordering the defendant to remove his earth-moving equipment (Caterpillar) from the premises pending the determination of this suit, the defendant has refused to comply. My Lord, my Client is apprehensive that the continued stay of this equipment may result in the eventual demolition being threatened. We seek that his Lordship orders the enforcement of his earlier ruling.\n\nJustice Boniface: Is that the position, Counsel?\n\nFrancis Ibe: (stammering) ye... .yes, to some extent my lord. Since the equipment and the premises are properties of my client I don\'t think it matters if it remains on the premises.\n\nJustice Boniface: Are you demeaning the authority of this honourable Court, or you are trying to subject my order to your own personal interpretation?\n\nFrancis Ibe: My lord, we have filed a Motion to have our claim proved within the shortest time possible.\n\nJustice Boniface: In spite of whatever steps the defendant intends to take, the ruling of this Court must first be complied with and must be so done before the next adjourned date.' },
      { key: 'wahid-press', text: 'Wahid, a legal Practitioner was instructed by his client to bring an action in negligence and for damages for injuries sustained by his client from a car accident which happened along Lagos/Shagamu Express way on the 10th of February 2019. The action was filed on 12th March 2019 before Hon. Justice Kolakula of the Ikeja Judicial Division of Lagos State High Court. Following the proceedings of the day and feeling aggrieved with the outcome of events, Wahid spoke to the press thus:\n\n\'I do not have the least confidence in the Judge, who can clearly be referred to as a clown, a comedian of some sort\'' },
      { key: 'walter-ochen', text: 'Chief Walter Ochen, a senior member of the Bar was at the High Court of Rivers State before Honorable Justice Nwameka Okafor U. He insisted on having his matter which was for hearing out of turn. The Court refused and decided to deliver a judgment which was ready.\n\nChief Walter Ochen being dissatisfied with the conduct of the judge, made a comment \'these days, all sort of people find their way to the Bench\'. Furious with the conduct, Justice Nwameka ordered Walter Ochen to enter the dock.' },
      { key: 'ferdinand-jobose', text: 'Mr. Ferdinand Jobose is a legal practitioner representing Mrs. Onome Edore in a civil suit at the High Court of the FCT for the recovery of a debt of ₦45 million naira owed her by Shinzu Company Ltd. On the 14th of March, 2020, the hearing day of the suit, Mr. Jobose arrived court late at which time the judge had struck out the case. Mr. Jobose in anger addressed the judge rudely claiming that the judge has always been biased towards his case. He subsequently stormed out of the Court and addressed the press accusing the judge of having taken a bribe from the opposing party hence he hurriedly struck out the case.' },
    ],
    questions: [
      { scenario: 'alex-victor-court', prompt: 'If ruling not complied with, Francis Ibe may be charged with:', options: ['Criminal conspiracy', 'Civil contempt', 'Criminal contempt', 'Contempt in facie curiae'], correct: 1, explanation: 'Civil contempt is the most appropriate because it consists of disobedience of court order, judgment or other processes.' },
      { scenario: 'alex-victor-court', prompt: 'If Alex Victor wants to bring application to enforce contempt, he will apply to Court to issue Notice to show cause in form___of SCPA Judgment Enforcement Rules:', options: ['Form 47', 'Form 48', 'Form 49', 'Form 50'], correct: 2, explanation: 'The heading of FORM 49 is notice to show cause why order of attachment should not be made.' },
      { scenario: 'wahid-press', prompt: 'Which is correct?', options: ['Wahid\'s statement was truthful assessment', 'Wahid\'s statement was contemptuous of court', 'Wahid\'s statement was criminal offence against state', 'None'], correct: 1, explanation: 'Wahid\'s statement was contemptuous of court.' },
      { scenario: 'wahid-press', prompt: 'Assuming Wahid\'s statement was contemptuous, what type?', options: ['Contempt in facie curiae', 'Contempt ex-facie curiae', 'Contempt in the face of the land', 'Contempt ab-initio'], correct: 0, explanation: 'It does not matter that statements were made outside court, so far they were directed at the judge, it is contempt in facie curiae.' },
      { scenario: 'wahid-press', prompt: 'Maximum punishment for contemptuous statement:', options: ['3 months', '6 months', '9 months', '12 months'], correct: 0, explanation: 'Under Sec. 133 of the Criminal Code, the maximum punishment for criminal contempt is 3 months.' },
      { scenario: 'walter-ochen', prompt: 'Chief Walter\'s conduct is best described as:', options: ['Civil contempt', 'Contempt on procedure', 'Contempt ex facie curie', 'Contempt in facie curie'], correct: 3, explanation: 'Chief Walter Ochen\'s conduct is contempt in facie curiae.' },
      { prompt: 'Assuming civil contempt, maximum punishment:', options: ['6 months', '3 months', '2 years', '1 year'], correct: 0, explanation: 'The maximum punishment for civil contempt is 6 months imprisonment.' },
      { scenario: 'walter-ochen', prompt: 'Judge\'s order to enter the dock means:', options: ['He should face trial', 'He should give evidence', 'He should render apology', 'He should show cause'], correct: 3, explanation: 'It is an order to show cause why he should not be committed to prison for the contempt committed.' },
      { prompt: 'Members of the Bar pleading on behalf of Chief Walter Ochen would be doing so as:', options: ['Committee of friends', 'Out of mandatory duties to Court', 'Amicus curiae', 'Any of the above'], correct: 2, explanation: 'Members of the Bar pleading on behalf of Chief Walter Ochen would be doing so as amicus curiae.' },
      { prompt: 'If Walter Ochen refuses to apologise, Court may order:', options: ['Kept in police custody until he purges himself', 'Kept in prison until he purges himself', 'Kept under house arrest until he purges himself', 'All of the above'], correct: 1, explanation: 'If Walter Ochen refuses to apologise, the Court may order him kept in prison until he purges himself.' },
      { scenario: 'ferdinand-jobose', prompt: 'Mr. Jobose\'s conduct is breach of rule___of RPC:', options: ['Rule 14', 'Rule 30', 'Rule 37', 'Rule 27'], correct: 1, explanation: 'Mr. Jobose\'s conduct is a breach of Rule 30 of the Rules of Professional Conduct.' },
      { scenario: 'ferdinand-jobose', prompt: 'Judge wants to cite Jobose for bribery accusation, type of contempt:', options: ['Contempt of accusation', 'Contemptuous conduct', 'Civil contempt', 'Criminal contempt'], correct: 3, explanation: 'The bribery accusation constitutes criminal contempt.' },
      { scenario: 'ferdinand-jobose', prompt: 'Procedure for citing Jobose for contempt for rude conduct:', options: ['Judge will summarily try Jobose', 'Judge will commence full criminal trial', 'Judge will refer to another judge', 'Judge will lodge formal complaint to police'], correct: 0, explanation: 'Criminal contempt can be summarily tried by the Judge.' },
      { prompt: 'If Jobose tried by another judge, Court to institute matter:', options: ['Magistrates Court of FCT', 'Customary Court', 'A High Court of FCT', 'Federal High Court of FCT'], correct: 2, explanation: 'Magistrates\' Court does not have power over civil contempt of this nature.' },
      { prompt: 'Standard of proof in contempt in facie curiae:', options: ['Balance of probability', 'Beyond reasonable doubt', 'Proof to satisfaction of Court', 'Clear and convincing evidence'], correct: 1, explanation: 'Proof of contempt, whether civil or criminal, is beyond reasonable doubt. This is because the outcome of contempt is penal in nature.' },
      { prompt: 'Type of contempt dealt with summarily:', options: ['Contempt in facie curiae', 'Contempt ex facie curiae', 'None', 'All'], correct: 0, explanation: 'Contempt in facie curiae is dealt with summarily.' },
    ],
  },
  {
    courseId: 1,
    topicName: 'Rules of Interpretation of Statutes',
    scenarios: [],
    questions: [
      { prompt: 'Judge must first give literal meaning but where ambiguity/inconsistency/absurdity arises, he varies or modifies meaning to give effect to intention of law makers. He would be adopting:', options: ['Mischief rule', 'Golden rule', 'Ejusdem generis', 'Noscitur a socis'], correct: 1, explanation: 'The Golden rule is developed to prevent absurdity in the meaning of a statutory provision.' },
      { prompt: 'Grey v Pearson is authority for:', options: ['Beneficial construction rule', 'Literal Rule', 'Golden Rule', 'Purposive Rule'], correct: 2 },
      { prompt: "Heydon's case is known for:", options: ['Mischief Rule', 'Golden Rule', 'Literal Rule', 'Purposive Rule'], correct: 0 },
      { prompt: 'Where words are clear and unambiguous, they must be construed according to ordinary, plain and natural meaning. This is the gist of:', options: ['Golden Rule', 'Literal Rule', 'Ejusdem generis', 'Mischief rule'], correct: 1 },
      { prompt: 'Under Wills Law, a man must make reasonable financial provision for children and dependants. To prevent a child who kills his father from benefiting, what rule will be used?', options: ['Literal Rule', 'Ejusdem generis', 'Mischief rule', 'Golden Rule'], correct: 3, explanation: 'It would be absurd to allow a child who killed his father to benefit under the provision. Thus, the golden rule will be used to avoid this absurdity.' },
      { prompt: 'Doctrine of construing documents that are ambiguous against the maker:', options: ['Ut res magisvale at quam pereat', 'Generalibus specialia derogant', 'Ejusdem generis', 'Contra preferentem'], correct: 3, explanation: 'The contra proferentem rule means that the words of a written document, usually an exclusion clause in a contract, are construed more forcibly against the party using them.' },
      { prompt: 'Which case is mismatched to the principle?', options: ['Golden Rule - Beck v Smith', 'Purposive Rule - PDP v INEC', 'Ejusdem Generis Rule - R v Bangaza', 'Mischief Rule - Savannah Bank v Ajilo'], correct: 2, explanation: 'R v Bangaza is an authority for the literal rule of interpretation.' },
    ],
  },
  {
    courseId: 1,
    topicName: 'Trial Advocacy',
    scenarios: [
      {
        key: 'akin-alabi-courtroom',
        text:
          'In the course of your externship, you witnessed the following in open court. When the case of Mr. Akin Alabi Esq. was called, he stood up, announced his appearance and likewise Mrs Elumelu, counsel for the defendant. Shortly in between the case, Honorable Justice Chinukwe cautioned Mr. Akin Alabi over his unsavoury use of words on Mrs Elumelu, the opposing counsel with regard to her failure to produce a key witness for cross examination. However, Mr. Akin-Alabi did not heed to the words of the Judge but continued to berate Mrs. Elumelu.',
      },
    ],
    questions: [
      { prompt: 'Order of examination of witnesses:', options: ['First-examination, cross-examination, re-examination', 'Pre-examination, cross-examination, re-examination', 'Examination-in-chief, cross-examination, re-examination', 'Cross-examination, cross cross-examination, re-examination'], correct: 2, explanation: 'Section 215 of the Evidence Act.' },
      { scenario: 'akin-alabi-courtroom', prompt: 'Cross-examination is important to Mr. Akin Alabi for all EXCEPT:', options: ['To put across case of his client', 'To discredit testimony of witness', 'To elicit facts favourable to client\'s case', 'To clear ambiguities arising from witness testimony'], correct: 3, explanation: 'Cross examination is not intended to clear ambiguities from the testimony of the witness being cross-examined.' },
      { scenario: 'akin-alabi-courtroom', prompt: 'Mrs Elumelu\'s key witness was taken through a process qualifying him to be cross examined. That process is:', options: ['Oral examination', 'Final address', 'Pre-examination', 'Examination-in-chief'], correct: 3, explanation: 'It is when a witness has been examined-in-chief that the witness can then be cross-examined.' },
      { prompt: 'Land dispute case - witness refused to go out and was later called to testify. Fate of witness:', options: ['Incapable of testifying', 'Deemed in contempt', 'Testimony admissible but less weight', 'B and C'], correct: 3, explanation: 'The witness who refused to go out is still capable of testifying, but less weight will be attached to the testimony. And the witness is deemed to be in contempt of court.' },
      { prompt: 'Rule ordering witnesses out of court does NOT apply to:', options: ['Expert witnesses', 'Parties\' Counsel', 'Subpoenaed witnesses', 'Eye witnesses'], correct: 1, explanation: 'Sec. 212 of the Evidence Act.' },
      { prompt: 'Conditions document must fulfil before court will admit it EXCEPT:', options: ['Must have been signed at Court Registry', 'Must be pleaded', 'Must be relevant', 'Must be in a form admissible in law'], correct: 0, explanation: 'The three conditions necessary for admissibility of a document in a civil case are: the document must be pleaded, the document must be relevant and the document must be in a form admissible in law.' },
      { prompt: 'Certificate of title to land - original destroyed by fire. Secondary evidence admissible:', options: ['Any secondary evidence', 'Only certified true copy', 'Only photocopy', 'Written admission of defendant'], correct: 1, explanation: 'Certificate of title to the land is a public document, and the only form of secondary evidence of a public document admissible in court is the certified true copy. Sec. 90(1)(b), Evidence Act.' },
      { prompt: 'Belief that sky is the limit in cross examination is not true because only one question is allowed:', options: ['Questions intended to insult', 'Questions injuring witness\' character to shake credit', 'Questions intended to annoy', 'Questions needlessly offensive'], correct: 1, explanation: 'Sec. 223, 227 and 228 of the Evidence Act.' },
      { prompt: 'All but one are functions of cross examination:', options: ['To introduce undisputed facts', 'To test veracity or credibility of witness\'s testimony', 'To put forward client\'s version of disputed facts', 'To lay foundation for introduction of exhibits'], correct: 0 },
      { prompt: 'NOT a technique of cross examination:', options: ['Probing technique', 'Impeaching technique', 'Insinuation technique', 'Confrontation technique'], correct: 1, explanation: 'Impeaching is not one of the known techniques of cross-examination.' },
      { prompt: 'Questions encouraged at cross examination:', options: ['Introductory questions', 'Open questions', 'Closed questions', 'None'], correct: 2, explanation: 'Closed questions are encouraged to be asked during cross-examination.' },
      { prompt: 'Judge discouraged the use of ___ when examining witness in chief:', options: ['Non-leading questions', 'Leading questions', 'Open questions', 'All'], correct: 1, explanation: 'Leading questions are not allowed during examination-in-chief, except in certain instances like introductory matters or undisputed facts. Sec. 221 of the Evidence Act.' },
      { prompt: 'Leading questions only allowed in instances such as:', options: ['Open matters', 'Non-secret matters', 'Contentious matters', 'Introductory matters'], correct: 3 },
      { prompt: 'Witness kept giving contradictory answers. Lawyer applied to Court to:', options: ['Call in police for arrest', 'Call adverse party to testify', 'Cross examine him to declare hostile witness', 'Tender evidence of his bad character'], correct: 3, explanation: 'A reading of section 230 of the Evidence Act shows that a party can, when a witness proves hostile, apply to the court to tender evidence of bad character of the witness.' },
      { prompt: 'Effect of case being struck out EXCEPT:', options: ['Court becomes functus officio', 'Doctrine of res judicata applies', 'Case is absolutely dead', 'Case can be relisted on application'], correct: 3 },
    ],
  },
  {
    courseId: 1,
    topicName: 'Legal Practitioners Remuneration',
    scenarios: [
      {
        key: 'chuks-emele',
        text: 'Work Force Group, a company that specialises in outsourcing services employed Chuks Emele Esq., the Principal Partner of Chuks Emele & Co. to represent the company in all matters it has in court and to serve as the regulatory compliance officer of the Company.',
      },
      {
        key: 'omega-omotunde',
        text: 'Omega Omotunde, a property transaction lawyer, was retained by First Bank of Nigeria PLC to act for the bank in all mortgage transactions. One of his friends, Obi Chukwudi approached him to represent him in negotiation and perfection of a mortgage transaction with First Bank of Nigeria, which the latter did not object to. The value of the loan advanced to Obi Chukwudi is ₦10,000,000 (Ten Million Naira Only).',
      },
    ],
    questions: [
      { scenario: 'chuks-emele',
        prompt: 'The relationship between Chuks Emele and Work Force Group is best described as:',
        options: ['Special Retainership', 'Ordinary Retainership', 'General Retainership', 'Specific Retainership'],
        correct: 2 },
      { scenario: 'chuks-emele',
        prompt: 'Obianuju Umezi, a client of Work Force Group, approaches Chuks Emele to represent her in a suit against Work Force Group. What is the position of the law?',
        options: [
          'Chuks Emele cannot represent Obianuju',
          'Cannot represent but another lawyer in his firm can',
          'Chuks Emele can represent Obianuju',
          'Can only represent after disclosing and Work Force does not object',
        ], correct: 0,
        explanation: 'This is a direct case of conflict of interest and Chuks Emele is enjoined to decline the brief. Rule 20, RPC.' },
      { prompt: 'Contingent fee is in Rule ___ of the RPC:',
        options: ['Rule 51', 'Rule 50', 'Rule 52', 'Rule 53'],
        correct: 1 },
      { prompt: 'Based on number of times counsel appears in proceedings, the type of fee charged is:',
        options: ['Contingency fee', 'Fixed fee', 'Retainer fee', 'Appearance fee'],
        correct: 3 },
      { prompt: 'For non-contentious matters, charges may be made using:',
        options: ['Scale I', 'Scale II', 'Scale III', 'Any of the above'],
        correct: 3 },
      { prompt: 'Examples of non-contentious matters include all EXCEPT:',
        options: ['Litigation and land searches', 'Arbitration and registration of companies', 'Litigation and arbitration', 'None of the above'],
        correct: 3,
        explanation: 'Examples of non-contentious matters include representing a client in a sale of land transaction or mortgage transaction, drafting and perfecting a deed of assignment.' },
      { prompt: 'Types of fee in criminal case EXCEPT:',
        options: ['Contingent fee', 'Appearance fee', 'All of the above', 'None'],
        correct: 0,
        explanation: 'Contingent fees are prohibited in criminal cases. Rule 50(2), RPC.' },
      { prompt: 'Searches at Land Registry and CAC are charged under:',
        options: ['Scale IV', 'Scale III', 'Scale II', 'Scale I'],
        correct: 1 },
      { scenario: 'omega-omotunde',
        prompt: 'Omega Omotunde shall be entitled to charge:',
        options: [
          "Mortgagor's full fees and one half of mortgagee's fees",
          "Mortgagee's full fees and one half of mortgagor's fees",
          'One and half of legal practitioner\'s fees',
          "Mortgagee's full fees and mortgagor's full fees",
        ], correct: 1,
        explanation: "Where a solicitor acts for both parties in a mortgage transaction and charges using the scale, he will be entitled to the full fees of the mortgagee's legal practitioner and half of the fees the mortgagor's legal practitioner would be entitled to under the scale." },
      { scenario: 'omega-omotunde',
        prompt: 'Obi Chukwudi refused to pay fees. What is the first step under the LPA?',
        options: ['Resort to arbitration', 'Apply to High Court', 'Beg Obi Chukwudi', 'Draft and send bill of charges'],
        correct: 3,
        explanation: 'Sec. 16 of the LPA.' },
      { prompt: 'Court with original jurisdiction for recovery of professional fee:',
        options: ['District Court', 'Debt Recovery Tribunal', 'High Court of Justice', 'Multi-Door Court House'],
        correct: 2,
        explanation: 'It is the High Court that has jurisdiction to entertain matters relating to recovery of legal practitioners\' professional fee, the amount notwithstanding.' },
      { prompt: 'Appropriate mode of commencement for recovery of professional fee:',
        options: ['Originating Summons', 'Writ of summons', 'Claims', 'Originating application'],
        correct: 1,
        explanation: 'The mode of commencement of an action for recovery of professional fee is by writ of summons.' },
      { prompt: 'Period before instituting action after sending bill of charges:',
        options: ['21 days', '31 days', '30 days', 'One month'],
        correct: 3,
        explanation: 'Sec. 16(2)(b) LPA.' },
      { prompt: 'If bill of charges is too high, the option available is:',
        options: ['Request for taxation of the Bill', 'Bills of cost review', 'File action to mandate lawyer to prove Bill', 'None'],
        correct: 0,
        explanation: 'Sec. 17 LPA.' },
      { prompt: 'Time limit to exercise option after receipt of Bill:',
        options: ['10 days', '20 days', '1 month', '2 months'],
        correct: 2,
        explanation: 'Sec. 17(1) LPA.' },
    ],
  },
  {
    courseId: 1,
    topicName: 'Legal Practitioners Account Rules',
    scenarios: [
      {
        key: 'tunde-ojo',
        text: 'Tunde Ojo was called to the Nigerian Bar on 2nd November 2014. After his Call to Bar, he approached his father for assistance to start his practice. On November 6, 2014, his father gave him ₦1,000,000 and on the same day, his mother gave him ₦500,000. On Nov 8, he paid ₦300,000 for office accommodation and bought a second-hand car for ₦400,000. On November 9, he bought a desktop computer for ₦70,000 and a set of office furniture for ₦200,000. He bought law books for ₦50,000 and a complete set of Laws of the Federation 2004 for ₦200,000. On November 11, he opened an account with Zenith Bank Plc and deposited ₦100,000 for the running of the office. On November 15, he bought stationery ₦50,000 for the office.',
      },
    ],
    questions: [
      { prompt: 'Law requiring separate books of accounts:',
        options: ['Legal Practitioners\' Account Rules, 1992', 'Legal Practitioners\' Rules, 1975', 'Legal Practitioners\' Account Rules, 1964', 'Legal Practitioners Act, 1975'],
        correct: 2 },
      { prompt: 'Reasons for maintaining separate accounts EXCEPT:',
        options: ['Need to comply with law', 'Enables assessment of practice value', 'Automatically exempts from disciplinary actions', 'Enables knowing debtors and creditors at a glance'],
        correct: 2,
        explanation: "The fact that a legal practitioner maintains separate accounts as required by the Law does not automatically mean he can't be guilty of fraudulent actions, and liable to be prosecuted accordingly." },
      { prompt: 'Non-client money NOT payable into client account:',
        options: ['Amount of personal income tax payable by practitioner', 'Nominal sum for opening account', 'Trust money lumped with client money', 'Money accidentally paid into client\'s account'],
        correct: 0 },
      { prompt: 'Which of the following is not incorrect?',
        options: [
          'Solicitor may withdraw money paid into client\'s account by mistake without authority',
          'Solicitor can draw cheque in favour of own creditor from client\'s account',
          'Solicitor can withdraw from client\'s account to pay debt acknowledged in writing',
          'A and C',
        ], correct: 3,
        explanation: 'Rule 7, LPAR.' },
      { prompt: 'Body responsible for regulating compliance with LPAR:',
        options: ['NBA', 'General Council of the Bar', 'Council of Legal Education', 'Legal Practitioners Disciplinary Committee'],
        correct: 1,
        explanation: 'The General Council of the Bar or the Bar Council is responsible for administering the provisions of the LPAR.' },
      { prompt: 'Fees on account is classified as:',
        options: ["Client's money", "Solicitor's money", 'Trust money', 'None'],
        correct: 0,
        explanation: "Fees on account is money paid in advance by a client for legal work to be done by counsel. Until the work has been done, the money must remain in client account." },
      { prompt: 'Books of accounts NOT required:',
        options: ['Bills of charges', 'Journals', 'Cash Book', 'Ledger'],
        correct: 0 },
      { prompt: 'Order of columns in cash book:',
        options: ['Date - Particulars - Credit - Debit', 'Date - Credit - Debit - Particulars', 'Date - Credit - Particulars - Debit', 'Date - Particulars - Debit - Credit'],
        correct: 3,
        explanation: 'Date, Particular, Debit Credit (DPDC)' },
      { scenario: 'tunde-ojo',
        prompt: '₦100,000 deposited in Zenith Bank is recorded on which side of the cash book?',
        options: ['Debit side', 'Credit side', 'Balance carried down', 'Balance brought down'],
        correct: 1,
        explanation: 'The amount deposited is seen as expenditure, and in a cash book, expenditures are recorded under credit.' },
      { scenario: 'tunde-ojo',
        prompt: '₦1,000,000 gift by father is recorded on which side of the cash book?',
        options: ['Debit side', 'Credit side', 'Balance carried down', 'Balance brought down'],
        correct: 0,
        explanation: "Income or money received are 'debited' in the cash book." },
      { prompt: 'Legal practitioner may be ordered to obtain certificate by accountant instead of producing books EXCEPT:',
        options: ['On motion of Bar Council', 'On written complaint of third party', 'On written request of any NBA branch', 'All of the above'],
        correct: 1,
        explanation: 'Rule 22(1), LPAR.' },
      { prompt: 'Legal practitioner requested to submit books of account shall submit to:',
        options: ['Accountant nominated by him', 'Accountant appointed by him', 'Accountant appointed by Bar Council', 'B or C'],
        correct: 3,
        explanation: 'Rule 21 and 22 of the LPAR.' },
      { prompt: 'Secretary posts letter to registered address, deemed received after how many days:',
        options: ['10 days', '7 days', '3 days', '5 days'],
        correct: 0,
        explanation: 'Rule 22(2) of the Legal Practitioners Account Rules.' },
      { prompt: 'In ledger, receipts recorded on:',
        options: ['Debit side', 'Credit side', 'Balance carried down', 'Balance brought down'],
        correct: 1,
        explanation: 'In ledger, incoming funds or receipts are to be credited.' },
      { prompt: 'Books and records kept for least period of how many years from last entry:',
        options: ['2 years', '5 years', '6 years', 'None'],
        correct: 2 },
    ],
  },
  {
    "courseId": 4,
    "topicName": "WK 3: Legal Regime and Regulatory Bodies in Corporate Practice",
    "scenarios": [
      {
        "key": "s_corp3_1",
        "text": "During your Call to Bar celebration, your old time friend from University, Oredola Ibrahim who recently won the Tony Elumelu Grant for African Entrepreneurs met you and expressed his desire to acquire an incorporated status for his business, Skill NG currently registered as a business name. He instructed you to make his desire come through."
      }
    ],
    "questions": [
      {
        "prompt": "The principal institutions or bodies, which are statutorily vested with regulatory, supervisory and controlling authority over companies and their activities in Nigeria do not include:",
        "options": [
          "Corporate Affairs Commission",
          "Securities and Exchange Commission",
          "Nigerian Investment Promotion Commission",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "Which of the following accurately describes the qualification of the Registrar General of the Corporate Affairs Commission?",
        "options": [
          "He must be a legal practitioner who has been in active legal practice for 12 years and has at least 10 years experience in corporate law practice and administration",
          "He must be a legal practitioner who has been in active legal practice for 10 years and has at least 8 years experience in corporate law practice and administration",
          "He must be a legal practitioner who has been in active legal practice for at least 10 years and has at least 8 years experience in corporate law practice or administration",
          "He must be a legal practitioner who has been in active legal practice for 8 years and has at least 8 years experience in corporate law practice and administration"
        ],
        "correct": 2,
        "explanation": "See section 8(1), CAMA. Take note of the word \"or\"."
      },
      {
        "prompt": "The apex regulatory body for Nigeria's capital market is:",
        "options": [
          "The Nigerian Stock Exchange",
          "The Central Bank of Nigeria",
          "The Corporate Affairs Commission",
          "The Securities and Exchange Commission"
        ],
        "correct": 3,
        "explanation": "See section 13, ISA."
      },
      {
        "prompt": "What is the full meaning of NOTAP?",
        "options": [
          "Nigerian Office for Technology Acquisition and Promotion",
          "National Organisation for Technology Acquisition and Promotion",
          "Nigerian Organisation for Technology Acquisition and Promotion",
          "National Office for Technology Acquisition and Promotion"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "As Registrar General is to CAC, _____ is to NOTAP.",
        "options": [
          "Director General",
          "Chairman",
          "President",
          "Governor"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "The Corporate Affairs Commission has a total membership of _____.",
        "options": [
          "12",
          "10",
          "15",
          "20"
        ],
        "correct": 1,
        "explanation": "See section 2, CAMA."
      },
      {
        "prompt": "The quorum of the meeting of the Corporate Affairs Commission shall be:",
        "options": [
          "4",
          "5",
          "6",
          "7"
        ],
        "correct": 1,
        "explanation": "See section 5(3), CAMA."
      },
      {
        "prompt": "Which of the following enactments established the Securities and Exchange Commission?",
        "options": [
          "The Investments and Securities Act",
          "The Securities and Exchange Commission Act",
          "The Central Bank of Nigeria Act",
          "Nigerian Investment Promotion Commission Act"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "The One Stop Investment Centre (OSIC) is the brain child of:",
        "options": [
          "The Nigerian Investment Promotion Commission",
          "The Securities and Exchange Commission",
          "The Central Bank of Nigeria",
          "The Ministry of Trade and Investment"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp3_1",
        "prompt": "The first step you will take in order to carry out the instruction you were given by Oredola Ibrahim is?",
        "options": [
          "Conduct availability check and reservation of name",
          "Get accredited with the Corporate Affairs Commission",
          "Obtain enrolment at the Supreme Court",
          "File Application for registration of company"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp3_1",
        "prompt": "Accreditation of professionals with the Corporate Affairs Commission is only necessary as regards matters pertaining to:",
        "options": [
          "Part A of CAMA",
          "Part B of CAMA",
          "Part C of CAMA",
          "All of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp3_1",
        "prompt": "Which of the following is not part of accredited professionals with the Corporate Affairs Commission?",
        "options": [
          "Legal practitioners",
          "Chartered accountants",
          "Chartered auditors",
          "Chartered secretaries"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp3_1",
        "prompt": "One of the following documents is not required for the accreditation of legal practitioners with the Corporate Affairs Commission:",
        "options": [
          "NYSC exemption letter or discharge certificate",
          "Two passport photographs",
          "Receipt of payment of call fee",
          "Evidence of payment of prescribed fee"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "One of the following is incapable of being registered with the Securities and Exchange Commission as a capital market operator:",
        "options": [
          "Individuals",
          "Firms",
          "Companies",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "All but one of the following professionals can be registered with the Securities and Exchange Commission as a capital market operator:",
        "options": [
          "Legal practitioners",
          "Auditors",
          "Chartered secretaries",
          "Accountants"
        ],
        "correct": 2,
        "explanation": ""
      }
    ]
  },
  {
    "courseId": 4,
    "topicName": "WK 7: Promotion of Companies and Pre-incorporation Contracts",
    "scenarios": [
      {
        "key": "s_corp7_1",
        "text": "Clement and Sons Ltd was incorporated in September, 2020 with the total authorised share capital of ₦100,000. In order to take advantage of an investment opportunity by the government which requires the total combined assets of proposed applicants companies not to be less than ₦500,000, Mr. Clement approached First Bank for a loan of ₦400,000 to the company, making himself the guarantor by using his house as security for the loan."
      },
      {
        "key": "s_corp7_2",
        "text": "Mr. Adewole Alarara, Mr. Bush Coke, Alhaji Isah Bello want to incorporate a company for the production of toothpaste. They instructed Mr. Rashid Ajani who is a legal practitioner to help them in preparation of pre-incorporation documents. Mr. Adewole Alarara provided the apartment which is to be used as the office for the company while Mr. Bush Coke gave the sum of N10million to buy an official car for the proposed company and Alhaji Isah Bello gave N11million to buy furniture and employ workers for the proposed company."
      }
    ],
    "questions": [
      {
        "scenario": "s_corp7_1",
        "prompt": "From the scenario, which of the following accurately captures Mr. Clement's position?",
        "options": [
          "A promoter of the company",
          "A shareholder in the company",
          "A director of the company",
          "A creditor of the company"
        ],
        "correct": 0,
        "explanation": "Someone who undertakes to raise capital for a newly formed company is also called a promoter. See Sec. 61, CAMA."
      },
      {
        "scenario": "s_corp7_1",
        "prompt": "Assuming prior to the incorporation of the company, Mr. Clement contacted Oji Kalu, a professional Estate Valuer and Human Resource Manager to help secure the property that will be used for the registered office of the company and a little personality shopping for the proposed company in return for his professional fee. Also, Kemi, Precious and Jude subscribed to the memorandum of the company alongside Mr. Clement. Which of the following is true from the scenario?",
        "options": [
          "Only Oji Kalu and Mr. Clement can be regarded as promoters of the company",
          "Only Oji Kalu can be regarded as promoter of the company",
          "Oji Kalu and all the subscribers are promoters of the company",
          "All the subscribers minus Oji Kalu are promoters of the company"
        ],
        "correct": 3,
        "explanation": "See the proviso to Sec. 61 CAMA."
      },
      {
        "scenario": "s_corp7_1",
        "prompt": "All are duties owed by the promoters to the company except:",
        "options": [
          "Duty to account for money/properties received",
          "Duty not to make secret profit",
          "Duty not to expose the company to loss",
          "Duty to make sure the company must be successful"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp7_2",
        "prompt": "From the scenario, Mr. Rashid will be regarded in law as?",
        "options": [
          "A legal practitioner acting in a professional capacity engaged in procuring the incorporation of the company",
          "The lawyer of the company",
          "A member of the company",
          "A promoter of the company"
        ],
        "correct": 0,
        "explanation": "See the proviso to Sec. 61, CAMA."
      },
      {
        "scenario": "s_corp7_2",
        "prompt": "Mr. Adewole, Mr. Bush and Alhaji Isah stand in what relationship to the company?",
        "options": [
          "Agents of the company",
          "Trustees of the company",
          "Fiduciary relationship",
          "All of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp7_2",
        "prompt": "Mr. Oladiti wants to know the status of the acts of Mr. Adewole, Mr. Bush and Alhaji Isah upon incorporation of the company:",
        "options": [
          "The company cannot ratify because it was yet to be incorporated when the acts were performed",
          "The company is not bound except it ratifies after incorporation",
          "The company must pay back the expenses incurred by them",
          "None of the above"
        ],
        "correct": 1,
        "explanation": "Sec. 72, CAMA."
      },
      {
        "scenario": "s_corp7_2",
        "prompt": "Remedies for breach of fiduciary duties by a Promoter include the following except:",
        "options": [
          "Suing for damages for breach of fiduciary duties",
          "Declaratory and Injunctive remedy",
          "Rescission of contract and recovery of money paid",
          "Account for any profit made"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "The time limit to bring an action against a promoter who has been found wanting in its duties towards the company during its incorporation is?",
        "options": [
          "3 years",
          "6 years",
          "10 years",
          "No time limit"
        ],
        "correct": 3,
        "explanation": "Sec. 62(4) CAMA."
      },
      {
        "prompt": "Which of the following is not an example of pre-incorporation contracts?",
        "options": [
          "Joint Venture Agreement",
          "Memorandum of understanding",
          "Memorandum of Association",
          "Shareholders Agreement"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "In contrast to the position under the Common Law, a Company can now ratify pre-incorporation contracts by virtue of?",
        "options": [
          "Section 61 CAMA",
          "Section 71 CAMA",
          "Section 62 CAMA",
          "Section 72 CAMA"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "One of the following upheld the CAMA provision that a pre-incorporation contract may be ratified by the company upon incorporation.",
        "options": [
          "Kelner v Baxter",
          "Societe General Bank v Societe Generale Favouraiser",
          "Leopold Borrne v Sensolid",
          "Societe Generale Bank v Sem Edowire"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "The effect of inclusion of pre-incorporation contacts in the Memorandum of Association of a company is not all but one of the following:",
        "options": [
          "A compulsion to see the contract executed",
          "A mere strong desire to execute the terms of the contract",
          "A and B",
          "A thing of mere practice and procedure"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "The authority for your answer in question 12 is:",
        "options": [
          "Societe Generale Bank v Sem Edowire",
          "Societe General Bank v Societe Generale Favouraiser",
          "Twycross v Grant",
          "Edokpolor & Co Ltd v. Sem-Edo Wire Ltd"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "There can be more than one promoter to a company.",
        "options": [
          "True",
          "False",
          "The minimum is 2",
          "The maximum is 2"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "The following are essential features of pre-incorporation contracts except:",
        "options": [
          "They are binding on the company as soon as they are made",
          "They are binding on the promoter of the company",
          "They are not binding on the company unless ratified by the company",
          "They are made prior to the existence of the company"
        ],
        "correct": 0,
        "explanation": ""
      }
    ]
  },
  {
    "courseId": 4,
    "topicName": "WK 8: Foreign Participation in Nigerian Economy",
    "scenarios": [
      {
        "key": "s_corp8_1",
        "text": "Tony Stark International Company having its registered office in the United States was invited to Nigeria by the Federal Government to build Robot Javis to be used to combat the Boko Haram Terrorist group in the country. Tony Stark Int'l Company, on the receipt of the letter, started work in Nigeria without incorporating a company in Nigeria or obtaining letter of exemption from the Government."
      },
      {
        "key": "s_corp8_2",
        "text": "At the International Conference for trade liberalisation held at the headquarters of the World Trade Organisation, Geneva, Switzerland, the President of Nigeria, Muhammadu Buhari, while delivering an address, stated that Nigeria is committed to promoting international trade and emphasised that the country is now more than ever receptive to foreign investors especially in the agriculture and technology sectors and thus appealed to investors to invest in the country. As a result of the address of the President, Shinzu group of companies in China has decided to come to Nigeria to set up an Artificial Intelligence Company with the goal of helping Nigeria develop its technologies."
      }
    ],
    "questions": [
      {
        "scenario": "s_corp8_1",
        "prompt": "One of the following is incorrect:",
        "options": [
          "Tony Stark International company is qualified for exemption from registration",
          "Tony Stark International company cannot sue or be sued in Nigeria",
          "Tony Stark International Company is exempted from payment of company taxes",
          "None of the above"
        ],
        "correct": 1,
        "explanation": "See Sec. 60(b) CAMA."
      },
      {
        "scenario": "s_corp8_1",
        "prompt": "Assuming Tony Stark International Company does not qualify for exemption, which of the following regulatory agencies will not be needed when registering it as a Nigerian company?",
        "options": [
          "Federal High Court",
          "Corporate Affairs Commission",
          "Nigerian Investment Promotion Commission",
          "Securities and Exchange Commission"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp8_1",
        "prompt": "Certificate of capital importation is usually issued by:",
        "options": [
          "Securities and Exchange Commission",
          "Central Bank of Nigeria",
          "Nigerian Investment Promotion Commission",
          "Ministry of Trade and Interior"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "Business cannot be carried out in all of the following except:",
        "options": [
          "Arms and ammunition",
          "Narcotics and psychotropic drugs",
          "Military wears",
          "Steel production"
        ],
        "correct": 3,
        "explanation": "All the options apart from D contain things in the negative list in Sec. 17, 18 and 31 of the NIPC Act."
      },
      {
        "scenario": "s_corp8_2",
        "prompt": "Which of the following is not exempted from registration under Section 56, CAMA?",
        "options": [
          "Foreign companies invited by or with the approval of the Federal Government to execute any specified individual project",
          "Foreign companies which is in Nigeria to execute a specific loan project on behalf of a donor country or international organisation",
          "Foreign government owned companies engaged solely in import promotion",
          "None of the above"
        ],
        "correct": 2,
        "explanation": "Sec. 56 CAMA provides for foreign government-owned companies engaged solely in export, not import promotion activities."
      },
      {
        "scenario": "s_corp8_2",
        "prompt": "None of the following is incorrect about Shinzu Group of Companies in Nigeria except:",
        "options": [
          "The company does not qualify for exemption",
          "The company qualifies for exemption",
          "It seeks to undertake foreign direct investment in Nigeria",
          "It will not have the status of an unregistered company"
        ],
        "correct": 1,
        "explanation": "What the President did at the conference was a mere invitation to treat, and not the invitation within the contemplation of Sec. 56(1)(a), CAMA."
      },
      {
        "scenario": "s_corp8_2",
        "prompt": "Assuming Shinzu Group of Companies has incorporated a company in Nigeria and desires to bring in a large amount of foreign loan through an authorised dealer; one of the following is not an incentive available in respect of the foreign loan:",
        "options": [
          "Unfettered repatriation of profits made from the investment",
          "Exemption from money laundering investigations",
          "Unfettered right to alter the object clause in the Memorandum of Association to include manufacturing of military wears",
          "Unfettered right to purchase the equity of any Nigerian thus leading to 100% foreign ownership"
        ],
        "correct": 2,
        "explanation": "Manufacturing of military wears is a matter in the negative list."
      },
      {
        "prompt": "One of the following statements is wrong.",
        "options": [
          "An exempted company has the status of an unregistered company.",
          "Any exempted company must file its annual returns every calendar year to the CAC.",
          "A foreign company can sue and be sued in Nigeria.",
          "None of the above."
        ],
        "correct": 1,
        "explanation": "Exempted companies are expected to file annual reports, not annual returns. Sec. 57 CAMA."
      },
      {
        "prompt": "The saying \"an exempted company has the status of unregistered company\" means none but one of the following:",
        "options": [
          "An exempted company is exempted from payment of company taxes",
          "An exempted company is exempted from filing annual reports",
          "An exempted company cannot sue or be sued in Nigeria",
          "An exempted company is exempted from holding General meetings"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "The major legislation that regulates incentives and reliefs to foreign businesses in Nigeria is:",
        "options": [
          "Foreign Exchange (Monitoring and Miscellaneous Provisions) Act",
          "Companies Income Tax Act",
          "Industrial Inspectorate Act",
          "The Nigerian Investment Promotion Commission Act"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "The business capitalisation of Shinzu Group of Companies is ₦30,000,000. With that amount, the company is automatically entitled to the maximum expatriate quota of:",
        "options": [
          "2 positions",
          "3 positions",
          "4 positions",
          "5 positions"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "The types of expatriate quota do not include:",
        "options": [
          "Permanent until reviewed",
          "Temporary",
          "Fixed",
          "None of the above"
        ],
        "correct": 2,
        "explanation": "There are two types of expatriate quotas: Permanent until reviewed and temporary."
      },
      {
        "prompt": "Assuming Shinzu Nigeria Ltd is incorporated to carry on business in mining solid minerals, it shall be exempted from tax for the first _____ years of operation?",
        "options": [
          "5 years",
          "3 years",
          "2 years",
          "1 year"
        ],
        "correct": 1,
        "explanation": "Sec. 36, CITA."
      },
      {
        "prompt": "The NOTAP Act requires every contract or agreement between Nigerians and Non Nigerians involving transfer of foreign technology to be registered not later than:",
        "options": [
          "30 days",
          "60 days",
          "90 days",
          "None of the above"
        ],
        "correct": 1,
        "explanation": "Sec. 5(2) NOTAP Act."
      },
      {
        "prompt": "All but one of the following are considered as technology under the NOTAP:",
        "options": [
          "Use of trademarks",
          "Use of patented inventions",
          "Supply of technical expertise",
          "Supply of Service routers"
        ],
        "correct": 3,
        "explanation": "Sec. 4 NOTAP Act."
      },
      {
        "prompt": "An incentive that allows you get back import duties paid is:",
        "options": [
          "Duty draw back",
          "Duty repatriation",
          "Pioneer status",
          "Duty reservation"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "All but one of the following does not require CERPAC:",
        "options": [
          "Accredited diplomats",
          "ECOWAS citizens",
          "Children below 15 living with their parents",
          "A foreigner staying in Nigeria for more than 3 months"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "CERPAC means:",
        "options": [
          "Combined Expatriate Registration Permit Authorised Card.",
          "Combined Expatriate Residence Permit and Aliens Credit.",
          "Combined Expatriate Residence Permit and Allowance Card.",
          "Combined Expatriate Residence Permit and Aliens Card."
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "Foreign Indirect Investment is also known as:",
        "options": [
          "Foreign Portfolio Investment",
          "Foreign Direct Investment",
          "Foreign Trade Investment",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "The following are the procedures an alien who wants to register a business in Nigeria must follow except:",
        "options": [
          "Registration of the proposed company with the corporate affairs commission",
          "Registration of the company with the Central Bank of Nigeria",
          "Application for relevant permits and approvals",
          "Registration of the company with the Nigerian Investment Promotion Commission"
        ],
        "correct": 1,
        "explanation": "Companies are not registered with CBN."
      },
      {
        "prompt": "Assurances to foreigners to encourage them to invest directly in Nigeria with foreign loan include all but one of the following:",
        "options": [
          "The repatriation of capital and profit",
          "Purchase of foreign currency at the official rate from Central Bank of Nigeria",
          "Exemption from registering a company in Nigeria",
          "Prompt and adequate payment of compensation upon nationalisation of the foreign investment"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "The authority with the power to determine such other items that may be included in the negative list under the NIPC Act is:",
        "options": [
          "Nigerian Investment Promotion Commission",
          "The Federal Executive Council",
          "The Securities and Exchange Commission",
          "The Ministry of Trade and Investment"
        ],
        "correct": 1,
        "explanation": "See Sec. 31, NIPC Act."
      },
      {
        "prompt": "The maximum accumulated tax holiday available to an industry with pioneer status in Nigeria is:",
        "options": [
          "5 years",
          "3 years",
          "7 years",
          "4 years"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "The minimum amount of debt that can be considered under the debt-equity scheme/programme is:",
        "options": [
          "£150,000",
          "$150,000",
          "$250,000",
          "£250,000"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "Which of these cannot apply for exemption under section 56 of CAMA?",
        "options": [
          "Mr. Acmed, a foreign engineer desirous of working on a project for Lullaby and Sons Ltd",
          "A firm of engineers from Pakistan invited by the Abere Local Government with the approval of the Federal Government",
          "Lympho (Israeli) Inc. invited under the MOU between WTO and Nigerian Ministry of Trade",
          "Lee Kwan Yew Textiles Inc, a Chinese Government-owned company that exports textiles from Nigeria"
        ],
        "correct": 0,
        "explanation": "Section 56 CAMA."
      },
      {
        "prompt": "A foreign company seeking exemption from registration as a Nigerian company has to apply to:",
        "options": [
          "The Secretary General of the Federation",
          "The President of Nigeria",
          "The Attorney General of the Federation",
          "The Minister of Trade and Investment"
        ],
        "correct": 1,
        "explanation": "Section 56(1) CAMA."
      }
    ]
  },
  {
    "courseId": 4,
    "topicName": "WK 4-6: Choice of Business/Non-Business Organisation and Registration Documents",
    "scenarios": [
      {
        "key": "s_corp46_1",
        "text": "Mr. Emmanuel Alonge is desirous of acquiring an incorporated status for a family business. The business has been a legacy of long time. He wishes the business, when registered, to be one where there will be no limit to the liability members can incur. He has met you at your call to bar ceremony and informed you of these wishes and aspirations. Answer the following questions."
      },
      {
        "key": "s_corp46_2",
        "text": "Recently, you were invited to a meeting of the promoters of a company in Nigeria. At the meeting, you met Lionel Messi (17), Cristiano Ronaldo (24) and Neymar Junior (20), all Portuguese businessmen who have agreed to set up the business of Artificial Intelligence in Nigeria. They have retained your services to facilitate the registration of the company. The proposed name of the company is \"Dangote Artificial Intelligence Ltd\"."
      },
      {
        "key": "s_corp46_3",
        "text": "In a bid to curb the spread of the corona virus and to properly sensitise the people on the things that must be done to contain the spread, a group of Nigerian youths has formed an organisation to be known as 'War Against Corona Virus' with just one aim: to reach the most vulnerable in the society and impact them with the requisite knowledge and safety measures to take in curbing the spread of the virus. Answer the following questions 18-22 using the scenario."
      },
      {
        "key": "s_corp46_4",
        "text": "Alhaja Princess Simblat Kolawole (46years) and her sister Princess Anota Dosumu (42years) have agreed to register their business 'Princess Lace Boutique' at the Corporate Affairs Commission. They commenced the business at Idumota Market on 1st July, 2010. Their application was completed on their behalf by Mr Adewale Ayuba because they are not educated."
      },
      {
        "key": "s_corp46_5",
        "text": "Mr. Smart Uche was called to the Nigerian Bar on July 20, 2018. At the thanksgiving reception, the chairman of the occassion, an uncle of the 'New Wig', Chief Uchendu, instructed him to register two business outfits with the names: Uchendu Bros and Ebano Enterprises (Nig) Ltd at the Corporate Affairs Commission. Answer questions 31-35 using the scenario."
      },
      {
        "key": "s_corp46_6",
        "text": "\"Heroes for Nigeria\" is an association dedicated to the cause of promoting value-based leadership in Nigeria. Recently, the activities of the body were rewarded with an International award from the Judes Foundation, a body based in Israel. The award was accompanied by a cash prize of US $1,000,000 which was meant to enhance the operations of \"Heroes for Nigeria\". Part of the cash award was disbursed by the organisation as gifts in honour of some dedicated members. A few others who were excluded in the process had argued that the distribution ought to have been extended to all categories of members, especially as the mandate of the organisation is about to expire. Answer questions 36-39 using the scenario."
      },
      {
        "key": "s_corp46_7",
        "text": "At the recently concluded Extra-Ordinary General Meeting of Great Stark PLC, it was resolved to increase the share capital of the company from ₦5million to ₦10 million. The existing shareholders were offered right issues and bonus shares. New members were also invited to purchase the shares of the company. Dr. Jacquelle Zerb of the United States also bought shares."
      },
      {
        "key": "s_corp46_8",
        "text": "Toluwani and Blessing have decided to form a company to take over their business of cake making and event planning. They decided to invite their friends, Opeyemi and Olubanke to join them in subscribing to the shares of the company. They intend to form a private company limited by shares with its authorised share capital being ₦200,000 divided into 200,000 ordinary shares of ₦1 each."
      },
      {
        "key": "s_corp46_9",
        "text": "Diran Adesokan (22) and Eyinjuoluwa Olaweyu (17) are close friends, who while they were in school, started a business together. They registered the business under part B of CAMA known as 'House of Gold.' Being a business with a sporadic growth, both of them have decided to form a private company to take over the business. They agreed to bring in two other persons, Oreofe Olaleye (19) and Bukola Alada (23) to be part of the first subscribers of the company. Diran and Eyinju have also agreed that both of them will be the first directors of the company."
      },
      {
        "key": "s_corp46_10",
        "text": "James and Ekaite Edet are natives of Cross Rivers State. They have two sons, Gold and Silver aged 19 and 16 respectively. The Edets are proprietors of Edet Washerman situate in New Haven layout, Owerri. The business is valued at ₦450,000 only. The Edets have resolved to incorporate a company to take over their business."
      }
    ],
    "questions": [
      {
        "scenario": "s_corp46_1",
        "prompt": "The first step you would take to enable you carry out the instructions you were given is:",
        "options": [
          "Conduct availability check and reservation of name",
          "Get enrolled at the Supreme Court",
          "Seek accreditation with the Corporate Affairs Commission",
          "Seek accreditation with Securities and Exchange Commission"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_1",
        "prompt": "In the scenario above, what type of company will you recommend to Mr. Emmanuel Alonge that will suit his desire?",
        "options": [
          "Private Limited Liability company",
          "Private Company Limited by Guarantee",
          "Public Company Limited by Guarantee",
          "Private Unlimited Liability Company"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_1",
        "prompt": "The following are the types of business organizations recognised by the Companies and Allied Matters Act except",
        "options": [
          "Company Limited by Guarantee",
          "Sole Proprietorship",
          "Incorporated Trustees",
          "Partnership"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_1",
        "prompt": "In all but one of the following sectors, a company is required to be formed before business is commenced:",
        "options": [
          "Banking",
          "Insurance",
          "Health",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_1",
        "prompt": "Which of the following is an incorrect position of the law?",
        "options": [
          "A Private Company having 50 members and 20 other employees who are also members of the Company has contravened the provisions of the CAMA",
          "A Private Company must by its articles restrict the transfer of shares to members of the pubic",
          "Two persons can be entitled to ownership of a share at the same time",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_1",
        "prompt": "All the following business/non-business organisations can lawfully commence activities prior to registration with the Corporate Affairs Commission except:",
        "options": [
          "Incorporated Trustees",
          "Private Company Limited by Guarantee",
          "Private Company Limited by shares",
          "B and C"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_1",
        "prompt": "Which of the following suffers no disability in joining in the formation of a Company?",
        "options": [
          "A person less than 18 years where there is one other adult",
          "A person declared by a Court to be of unsound mind where there are other members of full age and capacity",
          "An un-discharged bankrupt except where there are other members of full age",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_1",
        "prompt": "Non business organizations that can be registered in Nigeria do not include:",
        "options": [
          "Sole Trader",
          "Company Limited by Guarantee",
          "Incorporated Trustees",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_1",
        "prompt": "As a general rule, the minimum and maximum age limit for appointment as a Director in private companies is",
        "options": [
          "21 years and 70 years respectively",
          "18 years and 70 years respectively",
          "18 years and 75 years respectively",
          "18 years and none respectively"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_2",
        "prompt": "The proposed name of the company is",
        "options": [
          "Prohibited by CAMA",
          "Restricted by CAMA",
          "Unsuitable for the purpose",
          "Not subject to any legal disability"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_2",
        "prompt": "The form for application for registration of the company is:",
        "options": [
          "Form CAC 1",
          "Form CAC 1.1",
          "Form CAC 1A",
          "Form CAC 2.1"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_2",
        "prompt": "Assuming the trio are desirous of registering the Nigerian-Portuguese Chambers of Commerce in Nigeria, it must be registered under:",
        "options": [
          "Part A of CAMA",
          "Part B of CAMA",
          "Part C of CAMA",
          "Part D of CAMA"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_2",
        "prompt": "The Nigerian-Portuguese Chambers of Commerce must be registered as a:",
        "options": [
          "Company Limited by Shares",
          "Incorporated Trustees",
          "Company Limited by Guarantee",
          "Business Name"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_2",
        "prompt": "The Nigerian-Portuguese Chambers of Commerce must be registered without:",
        "options": [
          "Directors",
          "Company Secretary",
          "Shareholding",
          "Memorandum and Articles of Association"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_2",
        "prompt": "Assuming the trio decided to incorporate a company to be called 'Sinzu Holding PLC', none, but one of the following, is incorrect:",
        "options": [
          "Formal application must be made to CAC for consent to register the company",
          "The proposed name of the company is prohibited under CAMA",
          "The proposed name of the company is restricted under CAMA",
          "There must be evidence of not less than two subsidiary companies"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "All except one of the following is correct about a private company",
        "options": [
          "It has a share capital of not less than N10,000",
          "It is exempted from holding statutory meeting",
          "It is exempted from having a company Secretary",
          "Its members shall not be less than two"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "One of the following requires, as a condition precedent to registration, evidence of ownership of a landed property or a statement in lieu",
        "options": [
          "A private company limited by guarantee",
          "An incorporated trustee",
          "A public company limited by shares",
          "All the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_3",
        "prompt": "Which of the following options is best suited for the registration of such organization:",
        "options": [
          "Company limited by guarantee",
          "Volunteers Hub",
          "Co-operative society",
          "Incorporated trustees"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_3",
        "prompt": "Which of the following is not a requirement for the registration of such organization with CAC?",
        "options": [
          "Consent of the Attorney General of the Federation",
          "Constitution of the organization",
          "Adoption of special clause",
          "Evidence of advertisement in the National dailies"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_3",
        "prompt": "Assuming the organization was successfully registered with the Corporate Affairs Commission, the Companies and Allied Matters Act provides that the organization should be known as:",
        "options": [
          "Registered trustees of War Against Corona-virus",
          "Volunteers Hub of War Against Corona-virus",
          "Incorporated trustees of War Against Corona-virus",
          "A or C above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_3",
        "prompt": "One of the following is not true about the proposed association:",
        "options": [
          "It can carry on its object without registration",
          "When registered, the association acquires legal personality",
          "Upon registration, the trustees of the association acquires legal personality and can sue and be sued",
          "The constitution must contain adoption of the special clause"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_3",
        "prompt": "The minimum number of trustees that may apply for registration under Part C of CAMA is:",
        "options": [
          "4",
          "2",
          "1",
          "5"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_4",
        "prompt": "The business should be registered on or before:",
        "options": [
          "29th July, 2010",
          "28th July, 2010",
          "8th July, 2010",
          "30th September, 2010"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_4",
        "prompt": "The application form must contain the following except:",
        "options": [
          "Signature of a magistrate, legal practitioner or Assistant Superintendent of Police",
          "The name and address of Mr Adewale Ayuba",
          "The address of the principal place of business of the proprietors",
          "Details of the partners and the nature of the business."
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_4",
        "prompt": "One of these is incorrect in respect of certificate of registration of the business?",
        "options": [
          "It raises a presumption of the existence of a partnership between the proprietors",
          "It does not give legal personality to the business",
          "It informs the public of the true identity of the proprietors",
          "It does not give priority to the name against subsequent registered companies or businesses"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "By the provision of Section 19 CAMA, membership of Partnerships, except that of Lawyers and Accountants shall not exceed?",
        "options": [
          "20 members",
          "30 members",
          "40 members",
          "50 members"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "The documents to be delivered to the Corporate Affairs Commission during the registration of the partnership include the following except",
        "options": [
          "Form CAC 1 - Availability and Reservation of name",
          "Qualifying certificate",
          "Two passport photographs of each partner",
          "Business Name Form 1 duly filled"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "In which of these organizations is there no automatic right to proxy attendance at general meetings except stated in the article",
        "options": [
          "Unlimited Liability Company",
          "Public Liability Company",
          "Company Limited by Guarantee",
          "Private Limited Company"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "Mr. Bolu Omotosho who owns a medium size shoe making business desires to acquire an incorporated status for the business; his best option would be to",
        "options": [
          "Register as a Business Name",
          "Register as a Public Company Limited by Shares",
          "Register as a Private Company Limited by Shares",
          "Register as a Private Company Limited by Guarantee"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "Tolu is a new wig who has been approached by a group of people who are about 35 in number but expect a similar number of people to join them as members after incorporation of their proposed company. What is the most suitable option of business organization?",
        "options": [
          "A Private Company Limited by Shares",
          "A Private Company Limited by Guarantee",
          "An Incorporated Trustee",
          "A Public Company Limited by Shares"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_5",
        "prompt": "After enrolment at the Supreme Court, Smart Uche Esq., is expected to be accredited at the Corporate Affairs Commission so as to be able to",
        "options": [
          "Register the Business Name and the Limited Liability Company",
          "Register the Business Name",
          "Register the Limited Liability Company",
          "Do any official transaction with CAC"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_5",
        "prompt": "Which of the following documents will be required by CAC for the registration of Uchendu Bros, but will not be needed to register Ebano Enterprises (Nig.) Ltd?",
        "options": [
          "Passport photograph",
          "Form for Availability and Reservation of name",
          "Evidence of payment of filing fee",
          "None of the above."
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_5",
        "prompt": "The proposed name: 'Ebano Enterprises (Nig) Ltd' is___",
        "options": [
          "Prohibited under CAMA",
          "Restricted under CAMA",
          "Without legal disability",
          "None of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_5",
        "prompt": "Which of the following is true of the two business outfits to be registered?",
        "options": [
          "They are both juristic personalities",
          "They are both judicial personalities",
          "Uchendu Bros becomes a juridical personality while Ebano Enterprise (Nig.) Ltd becomes a juristic personality",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_5",
        "prompt": "Which of the following documents is not required by the Companies and Allied Matters Act for the registration of Ebano Enterprises (Nig.) Ltd at the Corporate Affairs Commission?",
        "options": [
          "Memorandum and Articles of Association",
          "Form CAC 1: Availability check and Reservation of Name",
          "Evidence of payment of filing fee",
          "Letter of Consent from the Attorney General of the Federation"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_6",
        "prompt": "One of the following statements is true of the cash disbursement made to some members of Heroes for Nigeria",
        "options": [
          "Properties of the body can be disbursed to members only in the event of dissolution",
          "The move should have been limited to reimbursement of debts and out-of-pocket expenses",
          "To be valid, disbursement should be approved by the trustees because properties of the Association are vested in them.",
          "None of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_6",
        "prompt": "Which of the following options is a crucial factor for having the association registered?",
        "options": [
          "The trustees will not be a corporate body",
          "Perpetual succession ceases upon the order of the AGF",
          "Power to hold and dispose land",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_6",
        "prompt": "Who can bring an application for the dissolution of Heroes for Nigeria?",
        "options": [
          "The governing Body or Council",
          "One or more Trustees",
          "Members of the association constituting not less than 50% of the total membership",
          "All of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_6",
        "prompt": "\"Heroes for Nigeria\" is expected to maintain the following books except:",
        "options": [
          "Minutes Book",
          "Register of shareholders",
          "Register of Trustees",
          "Books of Account"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "After your Call to Bar ceremony, your friend's mum approached you to register her restaurant with the Corporate Affairs Commission as a sole proprietorship business. One of the following will be the first step you will take in order to carry out her instructions:",
        "options": [
          "Enrol at the Supreme Court as a legal practitioner",
          "Get registered at the Securities and Exchange Commission",
          "Get accredited with the Corporate Affairs Commission",
          "File CAC Form 1 to check for availability of name"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "One of the following is not a relevant document to register the business",
        "options": [
          "CAC 1",
          "CAC 1A",
          "CAC BN/1",
          "Recognised means of identification"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "One of the following is no longer mandatory for the registration of businesses under part B of CAMA:",
        "options": [
          "Accreditation of professionals",
          "Search for availability of name",
          "Completion of business name form",
          "Submission of passport photographs"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "Sole proprietorship has one of the following advantages over company limited by shares",
        "options": [
          "It is flexible as management is concentrated in one person",
          "It can last as long as the proprietor desires even after his demise",
          "Its business name, once registered, forecloses other business from taking the same name or a name so similar as will likely deceive the public",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "Which of the following business organisations under CAMA absolutely prohibits infants' participation in directing and managing the affairs of the organisation?",
        "options": [
          "Business Name registered under Part B",
          "Companies registered under Part A",
          "Incorporated Trustees registered under part C",
          "B and C"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "James Alufa and Adeyemi Ayeku are desirous of forming a partnership for the purpose of legal practice. One of the following will necessitate the compulsory registration of the partnership",
        "options": [
          "James Alufa and Adeyemi Ayeku",
          "Alufa and Ayeku",
          "Alufa J And Ayeku A",
          "J. Alufa and A. Ayeku"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "Assuming James Alufa is a minor, the application form for the registration of the partnership must in addition be signed by any of the following except",
        "options": [
          "A Judge",
          "A Magistrate",
          "A legal Practitioner",
          "A Police Officer of or above the rank of ASP"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_7",
        "prompt": "Assuming the company was yet to be incorporated and Dr. Jacquelle Zerb intends to be one of the first subscribers, one of the following will be required of her",
        "options": [
          "Driver's license",
          "National Identity Card",
          "The information page of her International passport",
          "All of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_8",
        "prompt": "At the incorporation of the company, what's the least number of shares that must have been fully subscribed to?",
        "options": [
          "50,000",
          "25,000",
          "100,000",
          "200,000"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_8",
        "prompt": "Assuming Toluwani and Blessing have decided to form their company with the goal of furthering research in baking and using the proceeds to help an orphanage, what type of company is most appropriate for their object?",
        "options": [
          "Private Company Limited by Shares",
          "Incorporated Trustees",
          "Public Limited Liability Company",
          "Private Company Limited by Guarantee"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_8",
        "prompt": "From your answer above, the name of the most appropriate organisation you have recognised must comply with one of the following",
        "options": [
          "It must end with the word \"(Incorporated Trustees of...\"",
          "It must start with the words \"Incorporated Trustee of...\"",
          "It must end with the words \"(Limited by Guarantee)\"",
          "It must end with the words \"Limited by Guarantee\""
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_9",
        "prompt": "None of the following is incapable of registering the company except",
        "options": [
          "Diran and Eyinju",
          "Oreofe and Bukola",
          "Diran and Bukola",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_9",
        "prompt": "One of the following documents will not be required for the registration of House of Gold Ltd",
        "options": [
          "Birth certificate of Eyinju issued by NPC",
          "Form CAC 1A",
          "Memorandum and Articles of Association",
          "None of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_9",
        "prompt": "Where the name, House of Gold LTD was found to be available yet, CAC refuses to register its MEMART, the proper step to take under section 36(2) CAMA will be to",
        "options": [
          "Give notice to CAC requiring it to seek Court direction within 21 days",
          "Take up action by originating summons and seek order of mandamus at FHC against CAC",
          "Give notice to CAC requiring it to seek Court direction within 30 days",
          "Apply to the FHC by petition seeking declaratory relief against CAC"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_9",
        "prompt": "The Articles of Association of the proposed company shall be in Part ____ of table A, first schedule to CAMA",
        "options": [
          "Part IV",
          "Part III",
          "Part II",
          "Part I"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_9",
        "prompt": "The Stamp Duty payable on the Memorandum and Articles of Association is",
        "options": [
          "Ad valorem",
          "Fixed",
          "40%",
          "No stamp duties is paid"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_10",
        "prompt": "The proposed company must have _____subscribers",
        "options": [
          "Four",
          "Three",
          "Two",
          "One"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_10",
        "prompt": "One of the following would not be accepted by CAC as a proposed name for the company",
        "options": [
          "Edet Washerman (Nig) Ltd",
          "JANDE Washerman (Nig) Ltd",
          "JEGS (Nig) Ltd",
          "Edet Wash (Nig) Plc"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_10",
        "prompt": "_____can be the first directors of the company",
        "options": [
          "James and Silver",
          "Silver and Gold",
          "Ekaite and Silver",
          "James and Gold"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_10",
        "prompt": "The following are the contents of a Memorandum of Association of a company except",
        "options": [
          "Name clause",
          "Object clause",
          "Capital clause",
          "Allotment clause"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp46_10",
        "prompt": "Statutory declaration of compliance under section E of FORM CAC 1.1 must be done by",
        "options": [
          "A legal practitioner who need not be accredited by CAC",
          "A legal practitioner in the service of CAC",
          "A legal practitioner that must be accredited by CAC",
          "A legal practitioner that must be accredited by CAC and SEC"
        ],
        "correct": 0,
        "explanation": ""
      }
    ]
  },
  {
    "courseId": 4,
    "topicName": "WK 9: Post Incorporation Matters",
    "scenarios": [
      {
        "key": "s_corp9_vodka_bank",
        "text": "Vodka Bank PLC was incorporated on the 1st of April, 2020. The following are preliminary matters post incorporation expected of the newly formed company."
      },
      {
        "key": "s_corp9_corp_search",
        "text": "Two major incidents that took place in the country within the 2nd quarter of 2012 drew the attention of the people to the field of corporate law practice. They are: the identity of the persons behind the companies implicated in the fuel subsidy scandal report; and the due registration of the ill-fated Dana Airlines Limited, that crashed on June 3rd 2012."
      },
      {
        "key": "s_corp9_emirate_nigeria",
        "text": "Emirate Nigeria PLC was incorporated in 2018. The company desires to change its name to Stamford Nigeria PLC."
      },
      {
        "key": "s_corp9_new_age",
        "text": "At the Annual General Meeting of New Age Nigeria LTD held on the 28th of April, 2019, the following resolutions were proposed and duly passed:\n\ni. The object clause of the company should be altered to include dealing in production and sale of clothes.\nii. The company be converted and re-registered as a public company.\niii. The authorised share capital should be increased from ₦10,000,000 to ₦50,000,000 by the creation of additional 40,000,000 ordinary shares of N1 each to rank pari pasu with existing shares of the company."
      },
      {
        "key": "s_corp9_platinum_solutions",
        "text": "Platinum Solutions Ltd was incorporated on the 10th of December, 2015 with its registered office at Enugu, Enugu State. The company was incorporated to carry on the business of sale and installation of ICT equipment and accessories with a share capital of ₦10 million. Sometime in 2017, Mr. Kinsley Eze, a director of the company in one of his several trips abroad met a Chinese by name, Yuam Jung who owns a company that manufactures ICT equipment and accessories in China. Mr. Yuam Jung agreed to bring his wealth of experience in exchange for shares in the company and it was agreed that Platinum Solution Ltd will be registered as Platinum Solution Plc."
      }
    ],
    "questions": [
      {
        "scenario": "s_corp9_vodka_bank",
        "prompt": "The following are preliminary matters post incorporation expected of the newly formed company except:",
        "options": [
          "Statutory declaration of compliance",
          "Publication of name",
          "Preparation and keeping of statutory books",
          "Filing of statement of affairs"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_vodka_bank",
        "prompt": "Vodka Bank PLC must publish its name on all but one of the following:",
        "options": [
          "Name plate outside all its offices",
          "Common seal",
          "Officers' houses",
          "Correspondence and official documents"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_vodka_bank",
        "prompt": "The statutory books Vodka Bank PLC is expected to keep do not include:",
        "options": [
          "Register of returns to CAC",
          "Register of substantial interest in shares",
          "Register of charges",
          "Accounting Records"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_vodka_bank",
        "prompt": "Within how many days after registering the company with CAC must the name of its subscribers be entered in the register of members?",
        "options": [
          "30 days",
          "1 month",
          "21 days",
          "28 days"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_vodka_bank",
        "prompt": "None but one of the following is correct about index of members:",
        "options": [
          "It is required for all public companies",
          "It is required for all public companies having more than 50 members",
          "It is required for all private companies",
          "It shall, at all times, be kept in a different place from the register of members"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_vodka_bank",
        "prompt": "A person is said to have substantial interest in shares when he holds _____ of unrestricted voting rights in a company:",
        "options": [
          "15%",
          "20%",
          "10%",
          "50%"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_vodka_bank",
        "prompt": "A person is required to give notice of being a substantial shareholder in a Public Company within how many days of becoming aware to the company?",
        "options": [
          "40 days",
          "30 days",
          "14 days",
          "15 days"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_vodka_bank",
        "prompt": "Which of the following laws relating to Corporate Law Practice will you look into to know when and how to file the statement of Affairs of Vodka Bank PLC?",
        "options": [
          "Central Bank of Nigeria Act",
          "Companies and Allied Matters Act",
          "Investment and Securities Act",
          "Banks and other Financial Institutions Act"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_vodka_bank",
        "prompt": "The Statement of Affairs must be filed with which of the following regulatory authorities?",
        "options": [
          "Central Bank of Nigeria",
          "Corporate Affairs Commission",
          "Securities and Exchange Commission",
          "The Nigerian Stock Exchange"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_vodka_bank",
        "prompt": "Who among the following is by Law entitled to a copy of the statement of Affairs of the Bank?",
        "options": [
          "The Director of the Company",
          "The Company Secretary",
          "The Creditor of the Company",
          "The Auditor of the Company"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_vodka_bank",
        "prompt": "Every year during which the bank carries on business, its Statement of Affairs must be filed on:",
        "options": [
          "First Tuesday in every February and first Monday in every August",
          "First Tuesday in every September and first Thursday in every January",
          "First Monday in every January and first Friday in every October",
          "First Monday in every February and first Tuesday in every August"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_corp_search",
        "prompt": "The Report which describes the outcome of the search is called?",
        "options": [
          "Land Registry Search Report",
          "Status Enquiry Search Report",
          "Corporate Search Report",
          "Availability Search Report"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_corp_search",
        "prompt": "The document obtained in the course of the search can be validly certified as a public document by:",
        "options": [
          "High Court of the State",
          "Federal High Court",
          "Corporate Affairs Commission",
          "Central Bank of Nigeria"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_emirate_nigeria",
        "prompt": "The procedure for change of name of the company includes the following except:",
        "options": [
          "Availability check and reservation of name",
          "Application to SEC to register the new name",
          "Holding a General meeting of the company to pass the necessary resolution",
          "Alteration of the common seal, certificate and letter heads of the company"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_emirate_nigeria",
        "prompt": "The type of resolution Emirate Nigeria PLC must pass at the general meeting to change its name is:",
        "options": [
          "Unanimous resolution",
          "General resolution",
          "Ordinary resolution",
          "Special resolution"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_emirate_nigeria",
        "prompt": "One of the following is not part of the documents to be submitted to CAC in order to validly change the name of the company:",
        "options": [
          "Copy of the resolution passed at the General meeting to change the name",
          "Original certificate of incorporation",
          "Copy of the balance sheet of the company not exceeding 6 months",
          "Evidence of payment of filing fees"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_emirate_nigeria",
        "prompt": "Upon successful change of name, CAC is expected to do the following except:",
        "options": [
          "Publication of name in a daily newspaper",
          "Advertisement of change of name in an official Gazette",
          "Issuance of New certificate of incorporation",
          "Enter the new name of the company in the register of companies"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_emirate_nigeria",
        "prompt": "Upon change of name of the company, the company is expected to do the following except:",
        "options": [
          "Alter the MEMOART to reflect the new name",
          "Alteration of the common seal, letter heads and official correspondence to reflect the new name",
          "Apply to the Federal High Court for sanctioning the new name",
          "Advertisement of change of name in a daily newspaper circulating worldwide"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_emirate_nigeria",
        "prompt": "A compulsory change of company name can be effected by the Corporate Affairs Commission if petition is sent within ______",
        "options": [
          "6 weeks of the registration of the company",
          "6 months of registration of the company",
          "3 months of discovery of the infringement",
          "3 months of registration of the company"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_emirate_nigeria",
        "prompt": "If CAC directs that the name of a company be compulsorily changed, what's the time frame for complying with such direction?",
        "options": [
          "Within 6 weeks from the date of the direction",
          "Within 4 weeks from the date of the direction",
          "Within 6 months from the date of the direction",
          "Within 4 months from the date of the direction"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_emirate_nigeria",
        "prompt": "The procedure for change of name is contained in what section of CAMA?",
        "options": [
          "Section 30",
          "Section 31",
          "Section 29",
          "Section 32"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "The type of resolution required to alter the object clause of the company is:",
        "options": [
          "Ordinary resolution",
          "General resolution",
          "Unanimous resolution",
          "Special resolution"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "Before the alteration of the object clause can be valid, the company is required to wait for how many days for possible objections to the alteration?",
        "options": [
          "21 days",
          "28 days",
          "25 days",
          "30 days"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "One of these persons cannot challenge the alteration of the object clause:",
        "options": [
          "Holders of 15% of issued shares of the company",
          "Secured debenture holders",
          "A member who lost the vote",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "If at the end of the protesting period, no petition was filed against the alteration and when returns were made to CAC, the Commission refused to register the alteration, the appropriate Court to appeal the Commission's decision to is:",
        "options": [
          "Investments and Securities Tribunal",
          "Court of Appeal",
          "Federal High Court",
          "National Industrial Court"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "The resolution required under the Companies and Allied Matters Act to validly increase the share capital of the company is:",
        "options": [
          "Ordinary resolution",
          "Special resolution",
          "Unanimous resolution",
          "General resolution"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "Within how many days of passing the resolution increasing the share capital must the Company give notice of that to CAC?",
        "options": [
          "14 days",
          "15 days",
          "21 days",
          "1 month"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "The form to be filled for return of increase in share capital is",
        "options": [
          "FORM CAC 2.4",
          "FORM CAC 2A",
          "FORM CAC 2.7",
          "FORM CAC 2.1"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "The following are the documents required to be filed with the Corporate Affairs Commission in order to increase the share capital of the company except:",
        "options": [
          "Printed copy of the notice of increase",
          "A copy of the resolution",
          "A statement of increase duly stamped",
          "A copy of the Balance sheet"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "Post increase of share capital action required of New Age Nigeria LTD includes all but one of the following:",
        "options": [
          "Obtaining certificate of increase from CAC",
          "Annexing a copy each of the resolution and certificate of increase to the Memo of the company",
          "Publication of the increase in at least 2 national newspapers",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "Within 6 months of passing the resolution increasing the share capital, the least total amount of shares that must be issued by the company is:",
        "options": [
          "12,000,000",
          "20,000,000",
          "12,500,000",
          "15,000,000"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "One of the following does not need the confirmation of the Federal High Court to be valid:",
        "options": [
          "Re-registration of LTD to PLC",
          "Re-registration of PLC to LTD",
          "Reduction of share capital of a company",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "Which of these is not one of the alterations to be made by New Age PLC in its Memorandum after its re-registration as a public company?",
        "options": [
          "The name clause",
          "The type clause",
          "The liability clause",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "Which of these is not one of the alterations to be made by New Age PLC in its Articles after its re-registration as a public company?",
        "options": [
          "Any clause on the qualification of a company secretary must be amended to reflect that required for PLC",
          "Any clause allowing written resolutions for General meetings must be deleted",
          "Subscription clause must be altered",
          "Clause on restriction on the transfer of shares must be removed"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "A person seeking to cancel a resolution for re-registration of a Public Company to Private Company must have not less than",
        "options": [
          "10% of Company's share capital",
          "15% of Company's share capital",
          "20% of Company's share capital",
          "5% of Company's share capital"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "It is statutorily required for a Public Company applying for re-registration as a Private Company to wait for possible objections for a period of?",
        "options": [
          "14 days",
          "28 days",
          "21 days",
          "30 days"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_new_age",
        "prompt": "The CAC form to be filled for application for re-registration of New Age Ltd as a public company is",
        "options": [
          "CAC FORM 2.6",
          "CAC FORM 2.7",
          "CAC FORM 2.4",
          "CAC FORM 2.1"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_platinum_solutions",
        "prompt": "As the Company Secretary of Platinum Solution Ltd, the Statutory Registers the company must keep before its re-registrations are as follows except:",
        "options": [
          "Register of members",
          "Register of charges",
          "Register of substantial interest in shares",
          "Register of Directors and Secretaries"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_platinum_solutions",
        "prompt": "None of the following statements is incorrect except one",
        "options": [
          "All public companies are required to keep index of members",
          "A private company can have a register of director's shareholding",
          "The register of members needs not be kept at the registered place of business provided it is within Nigeria",
          "All companies are required to keep accounting records"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_platinum_solutions",
        "prompt": "One of the following is not a prohibited re-registration under CAMA:",
        "options": [
          "ULTD - PLC",
          "PLC - ULTD",
          "ULTD - GTE",
          "ULTD - LTD"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_platinum_solutions",
        "prompt": "Online reservation of name can be done for a period of:",
        "options": [
          "60 days",
          "30 days",
          "90 days",
          "2 months"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp9_platinum_solutions",
        "prompt": "For a company limited by guarantee to increase its share capital, it must pass a/an:",
        "options": [
          "Ordinary resolution",
          "Special resolution",
          "Unanimous resolution",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      }
    ]
  },
  {
    "courseId": 4,
    "topicName": "WK 10-14: Corporate Governance I (Meetings, Directors, and Corporate Administration)",
    "scenarios": [
      {
        "key": "s_corp1014_mike_ijesha",
        "text": "Mr. Mike Ijesha aged 75, a business Mogul has concluded plans to invest in the Banking sector in Nigeria. In furtherance of this, he has consulted you to facilitate the incorporation of New Age Bank (Nigeria) PLC. He intends to take 80% of the total authorised share capital of the company at its formation. Also, he has plans to make himself and his wife, Mrs Ijesha to be the directors of the company. They intend to serve as the MD/CEO and Chairman of the company respectively."
      },
      {
        "key": "s_corp1014_marvel_studio",
        "text": "Marvel Studio PLC was incorporated in Nigeria in September 2019. The company has 300 members and has the following persons as its first directors: Tony, E. Elumelu, chairman of the company and a life director, Warren Buffet (director of operation), Bill Gates (a non-executive director), Melinda Brown (an executive director) and Steve Jobs (director of finance). The company has scheduled the 30th of June, 2020 as the day for its first Annual General Meeting and part of the agenda is the proposal of the following persons for appointment as directors of the company: Ngozi Iweala, aged 72 and Dangote Aliko, aged 17."
      },
      {
        "key": "s_corp1014_delicious_pizza_retire",
        "text": "Delicious Pizza Ltd was incorporated in 2018. At its incorporation, the company had two directors: Sharon and Unique. At its first Annual General Meeting held in December, 2019, the company re-elected the first directors and appointed Goodness, Joel, Joy and Mercy as other directors of the company. The company is set to have its second Annual General Meeting in December 2020. You followed your principal, Mr. Yusuf Emmanuel to the meeting, who was invited to give advice on certain issues, one of which was determining the exact number of directors that should retire at the meeting."
      },
      {
        "key": "s_corp1014_imperium_ix",
        "text": "Udeh Kosisochukwu, Mariam Olufisayo, Chiamaka Odenigbo, Alufa Temijuopelo, Rasheed Ijaodola and Mafua Muyiwa are the directors of Imperium IX Nigeria PLC. The company was incorporated on December 31, 2019. Your Principal is the company Secretary of the company and has invited you to the proposed board meeting."
      },
      {
        "key": "s_corp1014_board_draft",
        "text": "During your externship programme, your law firm field supervisor gave you an assignment to draft the notice of the first meeting of the Board of Directors of Delicious Pizza LTD, a company he was contracted to incorporate in 2019.\n\nDELICIOUS PIZZA LTD\n4, MARINA ROAD, LAGOS ISLAND\nRC No: 12344\n\n______________________ of the above named company will be held on the 20th of February, 2020 at the company's premises at 10:am to ______________________ in the agenda except ______________________\n\nDated this 7th day of February, 2019.\n\nSigned ______________________\nCompany Secretary"
      },
      {
        "key": "s_corp1014_emirate_bank",
        "text": "Emirate Bank PLC was incorporated on the 1st of December, 2019. The company is considering holding its statutory meeting before the end of the month of June, 2019. The principal of your law firm is the company secretary and has sought your views."
      }
    ],
    "questions": [
      {
        "prompt": "The following are Codes of Good Corporate Governance in Nigeria except",
        "options": [
          "Code of good corporate governance for Telecommunications Industry",
          "Code of good corporate governance for banks and discount houses issued by the Central Bank of Nigeria, 2014",
          "Code of good corporate governance for investments industries in Nigeria issued by the Nigerian Investment Promotion Commission, 2019",
          "Code of good corporate governance for public companies issued by the Securities and Exchange Commission, 2013"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "In the light of International Benchmark on Good Corporate Governance as adopted in Nigeria, one of the following is wrong:",
        "options": [
          "The office of the chairman of a company and the CEO shall not be occupied by the same person",
          "The office of the chairman of a company shall be occupied by an executive director",
          "In the composition of the board of directors, non-executive directors shall be more in numbers than executive directors",
          "Not more than 2 members of a family should be part of the board of directors"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "What's the full meaning of OECD",
        "options": [
          "Organisation for European Communities and Development",
          "Organisation of European Co-operation and Development",
          "Organisation for Economic Co-operation and Development",
          "Organised European Communities for Development"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_mike_ijesha",
        "prompt": "In the light of the CBN code for good corporate governance for banks and discount houses, what's the minimum authorised share capital of the proposed company?",
        "options": [
          "N500,000",
          "N20,000,000",
          "N25,000,000,000",
          "N25,000,000"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_mike_ijesha",
        "prompt": "What's the minimum number of directors the company is expected to have?",
        "options": [
          "5",
          "2",
          "10",
          "6"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_mike_ijesha",
        "prompt": "What's the maximum percent of equity ownership Mr. Mike Ijesha can have in the company?",
        "options": [
          "He can have as much as 99%",
          "20%",
          "50%",
          "5%"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "The Nigerian Code of Good Corporate Governance 2018 was established by:",
        "options": [
          "Securities and Exchange Commission",
          "The Central Bank of Nigeria",
          "The Financial Reporting Council of Nigeria",
          "The Corporate Affairs Commission"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "The theory of good corporate governance which posits that the company has more than the interest of its owners and employees at stake, but also that of the General public is:",
        "options": [
          "The German Model Theory",
          "The Agency Theory",
          "The Stewardship Theory",
          "The Stakeholder Theory"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "The following except one are some international best practices on good corporate governance:",
        "options": [
          "Unrestricted right to own large number of shares in large companies",
          "Transparency in the procedure for the appointment of auditors",
          "Adherence to the rules of corporate democracy and sovereignty",
          "Regular re-election of directors"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "None of the following is not among the stakeholders involved in the affairs of a company except:",
        "options": [
          "Creditors",
          "Suppliers",
          "Government",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "The following are recognised ways of appointing directors of a company except:",
        "options": [
          "By the subscribers in the Memorandum of Association",
          "By naming them in the Articles of Association",
          "By a named person in the Articles of Association",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "The resolution for the appointment of directors of a company is",
        "options": [
          "Ordinary resolution",
          "General resolution",
          "Unanimous resolution",
          "Special resolution"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "Which of the following statements is false?",
        "options": [
          "A written resolution can be used to appoint directors of a private company",
          "Generally, a single resolution can be used to appoint multiple directors of a private company",
          "Generally, a single resolution can be used to appoint multiple directors of a public company",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "Who appoints the Managing Director of a company?",
        "options": [
          "The shareholders at the General Meeting",
          "The Board of Directors at the Board Meeting",
          "The Court",
          "Any of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "At the Annual General Meeting of Marvel Studios Nigeria Ltd held on the 20th of March, 2020 at the company's headquarters in Lagos, Nigeria, there was a bomb blast in the room where all the shareholders and directors of the company were, killing all of them at the same time. What first step should be taken in this regard to keep the activities of the company going?",
        "options": [
          "Application to the Corporate Affairs Commission for an order to convene a meeting of all the personal representatives of the shareholders",
          "Application to the Corporate Affairs Commission for an order to convene a meeting of all the creditors of the company",
          "Application to the court for an order to convene a meeting of all the personal representatives of the shareholders",
          "Application to the Court for an order to convene a meeting of all the creditors of the company"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "Where share qualification is required, a director who is not qualified must obtain his share qualification within _____ after his appointment",
        "options": [
          "21 days",
          "One month",
          "Three months",
          "Two months"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "All but one of the following are generally entitled to remuneration:",
        "options": [
          "Managing Director of the company",
          "Chairman of the company",
          "Company Secretary",
          "Executive directors"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "An alternate director is appointed by the substantive director subject to confirmation of:",
        "options": [
          "The General meeting",
          "The Board of Directors",
          "All of the above",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "A company can be all, except one of the following:",
        "options": [
          "Member of another company",
          "Auditor of another company",
          "Secretary of another company",
          "None of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "The section of the Companies and Allied Matters Act dealing with life director is:",
        "options": [
          "Section 254",
          "Section 257",
          "Section 256",
          "Section 255"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "A director or member of a company who knows that a company carries on business after the number of directors has fallen below two for more than _____ shall be liable for all liabilities and debts incurred by the company during that period when the company so carried on business",
        "options": [
          "60 days",
          "30 days",
          "2 months",
          "3 months"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_marvel_studio",
        "prompt": "The following are the directors that are required by Companies and Allied Matters Act to retire at the Annual General Meeting:",
        "options": [
          "Tony E. Elumelu, Warren Buffet, Bill Gates, Melinda Brown and Steve Jobs",
          "Warren Buffet, Bill Gates, Melinda Brown and Steve Jobs",
          "Tony E. Elumelu, Bill Gates, Melinda Brown and Steve Jobs",
          "Tony E. Elumelu, Warren Buffet, Melinda Brown and Steve Jobs"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_marvel_studio",
        "prompt": "All the following except one are correct as regards the proposed appointment during the AGM:",
        "options": [
          "The two nominees are qualified for appointment",
          "The resolution required for appointment is ordinary",
          "Special notice is required for the appointment of Ngozi Iweala",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_marvel_studio",
        "prompt": "Under the Companies and Allied Matters Act, the quorum for the Annual General Meeting of Marvel Studios PLC shall be:",
        "options": [
          "100",
          "50",
          "30",
          "25"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "Upon subsequent appointment of directors at the General meeting of a company, which of the following returns must be filed at the Corporate Affairs Commission?",
        "options": [
          "CAC FORM 1.1",
          "CAC FORM 2.1",
          "CAC FORM 7A",
          "CAC FORM 7"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "The return you have identified above must be filed within how many days of the appointment?",
        "options": [
          "21 days",
          "14 days",
          "7 days",
          "15 days"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "\"But times have changed. A Company Secretary is a much more important person nowadays than he was in 1887.\" This was the view of Lord Denning MR in:",
        "options": [
          "Barnnet, Hoares Co Ltd v South London Tramways Co",
          "Panorama Guildford Ltd v Fidelis Furnishing Fabrics Ltd",
          "Re City Equitable Fire Insurance Co Ltd",
          "Regal Hastings v Gulliver"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "The appointment of a company secretary is done by:",
        "options": [
          "Board of Directors",
          "Managing Director",
          "Chairman of the Company",
          "Members in General Meeting"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "As a general rule, the minimum and maximum age limit for appointment as a Director in private companies is",
        "options": [
          "21 years and 70 years respectively",
          "18 years and 70 years respectively",
          "18 years and 75 years respectively",
          "18 years and none respectively"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "The following directors can be removed from office by the company except:",
        "options": [
          "Managing Director",
          "Chairman of the Board of Directors",
          "Life Director",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "All the following except one are publications required of directors:",
        "options": [
          "Register of directors' shareholding",
          "Register of directors and secretary",
          "Publication of name and particulars in trade catalogues",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "The following except one are instances where special notice is required:",
        "options": [
          "Removal of director",
          "Removal of an auditor before expiration of his term of office",
          "Change of name of a company",
          "Appointment of a person who is above 70 years as director of a PLC"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_delicious_pizza_retire",
        "prompt": "Under the Companies and Allied Matters Act, the directors that should retire at the meeting are:",
        "options": [
          "All the directors",
          "Sharon and Unique",
          "Sharon, Unique and Goodness",
          "Sharon, Unique and any other director who is willing"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_delicious_pizza_retire",
        "prompt": "The following are instances where a retiring director will not be deemed re-elected at the meeting where he retires, except:",
        "options": [
          "In default, where the retiring director offers himself for re-election",
          "Where the company resolves not to fill the vacated position",
          "Resolution for the re-election of the director had been put to vote and lost",
          "Another person has been nominated for appointment in place of the retiring director"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_delicious_pizza_retire",
        "prompt": "The exception to the retirement by rotation rule applicable to directors includes one of the following:",
        "options": [
          "Life directors",
          "If the Articles of Association permit otherwise",
          "If the Memorandum of Association permits otherwise",
          "A and B"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "The fiduciary duties the directors of Delicious Pizza LTD owe the company do not include:",
        "options": [
          "Duty of care and skill",
          "Duty not to make secret profits",
          "Duty not to fetter discretion to vote in a particular way",
          "Duty to exercise power for proper purpose"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "The decision of the Board of Directors is usually",
        "options": [
          "Unanimous resolution",
          "Special resolution",
          "Ordinary resolution",
          "General resolution"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "prompt": "For a written resolution of the directors to be valid, it must be signed by",
        "options": [
          "Two-third majority of the directors",
          "Three-fourth majority of the directors",
          "A simple majority of the directors",
          "All the directors"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "prompt": "A life director is not affected by which of the following rules:",
        "options": [
          "Removal from office",
          "Vacation of office",
          "Retirement by rotation",
          "All of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "Gbadamose Jimoh is one of the directors of MVP Nigeria Ltd. He also doubles as the Secretary of the company. The company has prepared its balance sheet for the year to be submitted to CAC and such must be signed by a director and Secretary. In this instance, Gbadamose should:",
        "options": [
          "Sign both as the director and Secretary",
          "Sign as the Secretary not a director",
          "Sign as the director not a Secretary",
          "Not sign at all"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "The following except one are qualified to be appointed Secretary of a public company",
        "options": [
          "A legal practitioner",
          "A member of the Chartered Institute of Arbitrators",
          "A member of the Chartered Institute of Secretaries and Administrators",
          "A member of the Institute of Chartered Accountants of Nigeria"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "The following except one are duties of a company Secretary before a meeting of a company",
        "options": [
          "Send out notice of meeting",
          "Receive notice of proxy attendance",
          "Draft resolutions of the meeting",
          "Publish additional notice in two newspapers"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "The Secretary of a public company can be removed by:",
        "options": [
          "The Managing Director",
          "The General Meeting",
          "The Board of Directors",
          "The Chairman of the Board"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "The following except one are resolutions the company Secretary must forward to CAC within 15 days of their passing",
        "options": [
          "Resolution for the removal of directors",
          "Unanimous class resolution",
          "Resolution to reduce the share capital of the company",
          "Resolution for voluntary winding up of a company"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_imperium_ix",
        "prompt": "The Board Meeting of Imperium IX Nigeria PLC must be held not later than",
        "options": [
          "June 30, 2020",
          "May 31, 2020",
          "July 30, 2020",
          "August 31, 2020"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_imperium_ix",
        "prompt": "The following are the agenda of the first Board of Directors Meeting except:",
        "options": [
          "Appointment of Chairman",
          "Appointment of Managing Director",
          "Fixing the financial year of the company",
          "Appointment of first Secretary"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_imperium_ix",
        "prompt": "The quorum of the meeting shall be",
        "options": [
          "All members",
          "6",
          "3",
          "2"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_imperium_ix",
        "prompt": "The Board meeting has power to do the following except:",
        "options": [
          "Remove the Company Secretary",
          "Increase the capital of the company",
          "Appoint Managing Director for the company",
          "Recommend dividend for the company"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_imperium_ix",
        "prompt": "If the Chairman of the Board of Directors is not present within _____ after the time appointed for the holding of Board of Directors Meeting, the directors present may choose one of their members to be Chairman of the meeting.",
        "options": [
          "5 minutes",
          "15 minutes",
          "1 hour",
          "30 minutes"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_imperium_ix",
        "prompt": "The length of notice required under the Companies and Allied Matters Act to validly convene the meeting of the Board is",
        "options": [
          "28 days",
          "21 days",
          "14 days",
          "7 days"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_imperium_ix",
        "prompt": "One of the following is the legal implication of a failure to have a quorum at the meeting:",
        "options": [
          "The meeting will stand adjourned to the same place, day and time the following week",
          "The chairman of the Board will take a decision that will be binding on the Board",
          "The General Meeting may act in place of the Board",
          "An application may be made to court for an order directing one Director to take decisions on behalf of the Board"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_board_draft",
        "prompt": "[Fill blank line 1 — heading of the notice]",
        "options": [
          "Notice of Annual General Meeting of the Board of Directors",
          "Notice of the first statutory meeting of the Board",
          "Notice of General Meeting of the Board",
          "Notice of first board of directors meeting"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_board_draft",
        "prompt": "[Fill blank line 2 — opening line of the notice body]",
        "options": [
          "At the Extra-ordinary General Meeting",
          "At the Annual General Meeting",
          "Notice is hereby given that the first Board Meeting",
          "At the first Board Meeting"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_board_draft",
        "prompt": "[Fill blank line 3 — purpose wording]",
        "options": [
          "Pass the following resolutions",
          "Transact the following business",
          "Propose and if need be, pass the following resolutions",
          "Propose the following resolutions"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_board_draft",
        "prompt": "[Which item is NOT part of the agenda of the first board meeting?]",
        "options": [
          "Increasing the share capital of the company",
          "Fixing the financial year of the company",
          "Appointment of auditor of the company",
          "Appointment of the Chairman of the company"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_board_draft",
        "prompt": "[Fill in the signing line]",
        "options": [
          "Name of the company Secretary",
          "By order of the Board",
          "Name of the Managing Director of the Company",
          "Signature of the company secretary"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_emirate_bank",
        "prompt": "The Bank must hold its statutory meeting not later than?",
        "options": [
          "31st December, 2020",
          "31st April, 2020",
          "31st May, 2020",
          "31st June, 2020"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_emirate_bank",
        "prompt": "The following are entitled to receive notice of the statutory meeting except",
        "options": [
          "Every Member",
          "Every Promoter",
          "Every Director",
          "Every Auditor"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_emirate_bank",
        "prompt": "Failure to hold statutory meeting could be a ground for",
        "options": [
          "Automatic winding up",
          "Members' voluntary winding up",
          "Creditors' voluntary winding up",
          "Compulsory winding up"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_emirate_bank",
        "prompt": "The following statements are correct in respect of a statutory meeting except:",
        "options": [
          "It must be held within 6 months of incorporation",
          "It must be held by both public and private companies",
          "One of the agenda of the meeting must be to consider the statutory report",
          "It must be held in Nigeria"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_emirate_bank",
        "prompt": "The business to be transacted at a statutory meeting do not include",
        "options": [
          "Matters relating to the formation of the company and commencement of business",
          "Consideration of the statutory report",
          "Presentation of financial statement of the company",
          "Discussing matters arising from the statutory report"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_emirate_bank",
        "prompt": "The directors shall at least _____ before the day on which statutory meeting is held forward to every member a copy of the statutory report.",
        "options": [
          "28 days",
          "14 days",
          "7 days",
          "21 days"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1014_emirate_bank",
        "prompt": "The appointment of the first Secretary of Emirate Bank PLC was done by?",
        "options": [
          "The Board of Directors",
          "The first subscribers/promoters",
          "Members in General Meeting",
          "None of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "prompt": "The following are instances where voting by poll is disallowed except",
        "options": [
          "During board meetings",
          "Appointment of audit committee",
          "Removal of directors",
          "A and B"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "prompt": "The responsibility of declaration of dividends is that of",
        "options": [
          "The General Meeting",
          "The Board of Directors",
          "All of the above",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      }
    ]
  },
  {
    "courseId": 4,
    "topicName": "WK 10-14: Corporate Governance II (Meetings, Financial Statements, and Minority Protection)",
    "scenarios": [
      {
        "key": "s_corp1014b_sherlock",
        "text": "Sherlock Holmes Nigeria PLC is a company incorporated in Nigeria to promote technology as well as agriculture in the country. The first subscribers of the company are Williams Shakespeare, Thomas Hardy, Sir Arthur Colan Doyle and Charles Dickens. In early 2020, the company invited members of the public to purchase the shares of the company. Wole Soyinka purchased 500 shares and was given the necessary documents as evidence, but his name was accidentally omitted in the register of members by the company Secretary, Mr. Terry Goodking."
      },
      {
        "key": "s_corp1014b_transverse",
        "text": "Transverse Nigeria Ltd, a company dealing with business branding was incorporated on 25th August, 2018. At its first Annual General Meeting in January, 2020, the following resolutions were proposed and duly passed: (i) That the company be re-registered as a public company; (ii) That the share capital of the company be increased from ₦100,000,000 to ₦500,000,000 by the creation of additional 200,000,000 ordinary shares of N2 each."
      },
      {
        "key": "s_corp1014b_meetings",
        "text": "Ebonyplus PLC, a public company in Nigeria, is required to hold various meetings under the Companies and Allied Matters Act. The company Secretary is reviewing the legal requirements for convening general meetings, including Annual General Meetings and Extra-ordinary General Meetings, the rules on quorum, notice, and the role of the chairman."
      },
      {
        "key": "s_corp1014b_accessbank",
        "text": "You followed your principal who is the company Secretary of Access Bank PLC to the company's Annual General Meeting held in September 2019. One hour into the meeting, when deliberations were made on dividends to be paid, there were disagreements among members which led to exchange of words. In a bid to frustrate the meeting, members who felt aggrieved walked out maliciously with the intent that the quorum would not be met. Your principal was looked upon by the Chairman on what to do."
      },
      {
        "key": "s_corp1014b_specialres",
        "text": "The following questions relate to special resolutions under the Companies and Allied Matters Act, covering the voting threshold required and the types of decisions that must be reached by special resolution."
      },
      {
        "key": "s_corp1014b_nestle",
        "text": "Nestle Nigeria PLC has just concluded its 15th Annual General Meeting where it transacted both ordinary business and special business. 100 members were in attendance out of the total 300 members of the company."
      },
      {
        "key": "s_corp1014b_standard",
        "text": "Standard Bank PLC was incorporated on the 2nd of January, 2020. The company's Board of Directors held their first meeting on the 1st of March and one of the agenda was the determination of the financial year of the company. The following questions also cover accounting records and financial statements requirements under CAMA."
      },
      {
        "key": "s_corp1014b_auditors",
        "text": "The following questions relate to the appointment, qualification, and regulation of auditors and audit committees under the Companies and Allied Matters Act. Also covered is the case of Livestock Feeds PLC v. Igbino Farms on the financial position of a company."
      },
      {
        "key": "s_corp1014b_goodlife",
        "text": "The Annual General Meeting of Goodlife Ltd, with an annual turnover of ₦3,000,000, was held on the 24th of April, 2020 where all the ordinary businesses of an AGM were transacted alongside a few special businesses. The following questions also cover annual returns and the powers of the CAC regarding defunct companies."
      },
      {
        "key": "s_corp1014b_minority",
        "text": "The following questions relate to minority protection under the Companies and Allied Matters Act, covering the rule in Foss v Harbottle, derivative actions, and remedies for unfairly prejudicial and oppressive conduct."
      },
      {
        "key": "s_corp1014b_capitalgain",
        "text": "Capital Gain Venture Ltd is a key player in the energy sector in Nigeria. The Board of Directors is divided along the line of the major political parties in Nigeria. They have failed to hold Board Meetings or convene a General Meeting of the company. There is evidence that the Chairman and the Managing Director are running the affairs of the company in a manner that is unfairly prejudicial and oppressive. They have consistently bought themselves personal properties from the company's account and embarked on different journeys to expensive places, claiming those were necessary journeys embarked on behalf of the company."
      },
      {
        "key": "s_corp1014b_jajudet",
        "text": "Jane, Judith and Edet are the directors and shareholders of Jajudet Nigeria Limited. Jane and Judith conspired against Edet by refusing to carry him along in the management of the company. A huge sum of money was withdrawn from the company's account without reference to the Accountant and the auditor of the company. The company Secretary has refused to file returns as required."
      },
      {
        "key": "s_corp1014b_soundlight",
        "text": "Just Imagine is a shareholder in Sound and Light Ltd. For three years in a row, Just Imagine was completely left out in the affairs of the company. She was not given notices of meetings, and neither did she receive her share of the dividends declared consecutively. She later discovered this and found out the venue, date and time of the following Annual General Meeting of the company. While at the meeting, on a resolution of an increase in remuneration of the directors, her vote was discountenanced. The Chairman explained that as she was a lady, ladies were not entitled to vote at such meetings and on such resolutions. She was so furious and has decided to embrace minority actions under CAMA."
      }
    ],
    "questions": [
      {
        "id": "q_corp1014b_66",
        "scenario": "s_corp1014b_sherlock",
        "prompt": "The ways of becoming a member of a company do not include",
        "options": [
          "Subscription",
          "Acquisition",
          "Allotment",
          "Transfer"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_67",
        "scenario": "s_corp1014b_sherlock",
        "prompt": "From the scenario, the method through which Wole Soyinka sought to become a member of the company is:",
        "options": [
          "Allotment",
          "Acquisition",
          "Transfer",
          "Subscription"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_68",
        "scenario": "s_corp1014b_sherlock",
        "prompt": "If after notifying the company of the omission of his name in the register of members of the company, and the company fails to do so, the appropriate remedy Wole Soyinka should seek is:",
        "options": [
          "Petition for winding up of the company",
          "Derivative action",
          "Investigation into the affairs of the company",
          "Rectification of register of members"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_69",
        "scenario": "s_corp1014b_sherlock",
        "prompt": "The following are rights of members of a company except",
        "options": [
          "Right to notice of meeting",
          "Right to demand voting by poll",
          "Right to dividends even when not declared",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_70",
        "scenario": "s_corp1014b_transverse",
        "prompt": "Which of the following is not an ordinary business to be conducted at the Annual General Meeting of Transverse Nigeria Ltd?",
        "options": [
          "Appointment of members of the audit committee",
          "Election of directors in place of those retiring",
          "Declaration of dividends",
          "Presentation of financial statements"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_71",
        "scenario": "s_corp1014b_transverse",
        "prompt": "Whose duty it is to prepare the financial statements of Transverse Nigeria Ltd?",
        "options": [
          "The General Meeting",
          "The Audit Committee",
          "The Board of Directors",
          "A Qualified Chartered Accountant"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_72",
        "scenario": "s_corp1014b_transverse",
        "prompt": "The following except one must be included in the financial statements of Transverse Nigeria Ltd:",
        "options": [
          "Statement of accounting policies",
          "Balance sheet as at the last day of the financial year",
          "Profit and loss account",
          "Directors' report"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_73",
        "scenario": "s_corp1014b_meetings",
        "prompt": "The following meetings must be held in Nigeria except:",
        "options": [
          "Statutory meeting",
          "Annual General Meeting",
          "Extra-ordinary General Meeting",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_74",
        "scenario": "s_corp1014b_meetings",
        "prompt": "All of the following except one are correct as regards Annual General Meeting?",
        "options": [
          "Where a Company holds its first AGM within 18 months of incorporation, it need not hold an AGM in that year or in the following year",
          "The CAC shall have power to extend the time within which the first AGM shall be held",
          "The CAC shall have power to extend the time within which any AGM shall be held by a period not exceeding 3 months",
          "Not more than 15 months should elapse between one AGM and the next"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_75",
        "scenario": "s_corp1014b_meetings",
        "prompt": "Assuming during the Annual General Meeting of the company, the chairman is late by ______, the members present can appoint one of the directors present to chair the meeting and if the directors refuse to accept to chairman the meeting, the members will appoint from among themselves, one of the members to chair the meeting",
        "options": [
          "30 minutes",
          "10 minutes",
          "5 minutes",
          "1 hour"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_76",
        "scenario": "s_corp1014b_meetings",
        "prompt": "At the Extra-ordinary General Meeting of Ebonyplus PLC requisitioned by a member of the company, Mr. Nike Furry, convened to discuss urgent business matters. After one hour of the scheduled time, no quorum was yet to be formed. Which of the following is an accurate reflection of the position of the law as a consequence of absence of quorum at the requisitioned meeting?",
        "options": [
          "The meeting stands adjourned to same place and time, the following week",
          "The meeting shall continue with the members present",
          "The meeting shall be dissolved and that will be the end of it",
          "The fate of the meeting is dependent on the decision of the Chairman"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_77",
        "scenario": "s_corp1014b_meetings",
        "prompt": "The following except one are businesses that can be transacted at an Extra-ordinary General Meeting:",
        "options": [
          "Declaration of dividends",
          "Resolution increasing the share capital of the company",
          "Resolution changing the name of the company",
          "Removal of directors"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_78",
        "scenario": "s_corp1014b_meetings",
        "prompt": "Which of these businesses transacted at an Extra Ordinary General Meeting is an ordinary business?",
        "options": [
          "Declaration of dividends",
          "Presentation of financial statement",
          "All of the above",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_79",
        "scenario": "s_corp1014b_meetings",
        "prompt": "The following statements are correct about the Chairman of Ebonyplus PLC except:",
        "options": [
          "The Chairman is the only person that has right to casting/second vote in the event of a tie in voting.",
          "The chairman presides over Board Meetings and General Meetings of the Company.",
          "Where the Chairman of the Company is late to the Board of Directors Meeting by 5 minutes, the other directors present can appoint one of themselves to preside at the meeting.",
          "The chairman sees to the day-to-day running of the company."
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_80",
        "scenario": "s_corp1014b_meetings",
        "prompt": "The following can validly convene general meetings of Ebonyplus PLC except",
        "options": [
          "Directors of the Company",
          "Secretary of the Company",
          "Members of the company holding not less than 1/10th of the total shares of the company",
          "The court"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_81",
        "scenario": "s_corp1014b_meetings",
        "prompt": "The notice required for all types of General meetings shall be ............... from the date on which the notice was sent out",
        "options": [
          "28 days",
          "21 days",
          "14 days",
          "1 month"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_82",
        "scenario": "s_corp1014b_meetings",
        "prompt": "The circumstance where a shorter notice may be permitted for an Annual General Meeting of a company is",
        "options": [
          "Where it is agreed by the Corporate Affairs Commission",
          "Where it is agreed by special resolution of the company",
          "Where it is agreed by members representing 95% of the total voting rights of the company",
          "Where it is agreed by all the members of the company"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_83",
        "scenario": "s_corp1014b_meetings",
        "prompt": "Which of the following points on notice is incorrect?",
        "options": [
          "Every person entitled to be given notice must be served otherwise the meeting is invalid, notwithstanding that such non service was accidental",
          "All public companies in addition to personal service of notice of meeting must advertise a notice of such meeting in at least two national dailies",
          "A misinterpretation of the provisions of CAMA on notice is not an accidental omission and does render the meeting invalid",
          "All of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_84",
        "scenario": "s_corp1014b_meetings",
        "prompt": "Where a meeting commenced with the proper quorum, but some members withdraw, thus reducing the quorum,",
        "options": [
          "The Chairman must continue with the meeting because quorum is only required at the commencement",
          "The Chairman must adjourn the meeting because quorum is required throughout the meeting",
          "The Chairman has a discretion to continue with or adjourn the meeting depending on the reason for the withdrawal",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_85",
        "scenario": "s_corp1014b_meetings",
        "prompt": "Where a notice is sent by post and the letter is properly addressed and stamped, then the addressee is deemed to receive it within how many days after the letter is posted?",
        "options": [
          "12 days",
          "7 days",
          "14 days",
          "5 days"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_86",
        "scenario": "s_corp1014b_accessbank",
        "prompt": "In line with the provision of CAMA, the proper thing is?",
        "options": [
          "The meeting may continue with the members present and any decision reached will bind other members of the company",
          "The meeting shall be adjourned to the same place and time in a week's time",
          "Since there is absence of quorum with the members remaining, the Chairman should take a decision that will bind the company",
          "The Chairman should apply to CAC for guidance"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_87",
        "scenario": "s_corp1014b_accessbank",
        "prompt": "Assuming the meeting was adjourned by the Chairman to the same place and time in a week's time and after one-hour, no quorum is yet to be formed, then:",
        "options": [
          "The meeting stands adjourned to the same day, place and time in another week's time",
          "The members present shall form the quorum",
          "The members present will proceed to the court to seek its direction",
          "The members present will proceed to CAC to seek its direction"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_88",
        "scenario": "s_corp1014b_specialres",
        "prompt": "Special resolution is resolution reached by not less than",
        "options": [
          "Two-thirds majority of total members of the company",
          "Two-thirds majority of total number of votes cast",
          "Three-fourths majority of total members of the company",
          "Three-fourths majority of total number of votes cast"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_89",
        "scenario": "s_corp1014b_specialres",
        "prompt": "The following except one are examples of decisions reached by special resolution",
        "options": [
          "Change of company's name",
          "Alteration of company's articles",
          "Appointment of auditors",
          "Variation of class rights"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_90",
        "scenario": "s_corp1014b_specialres",
        "prompt": "Special notice under Section 236 CAMA is for?",
        "options": [
          "14 days",
          "21 days",
          "28 days",
          "24 days"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_91",
        "scenario": "s_corp1014b_nestle",
        "prompt": "The ordinary business of an Annual General Meeting includes the following except:",
        "options": [
          "Presentation of the financial statements of the company for the end of the financial year",
          "Presentation of the audit committee's report",
          "Declaration of dividends",
          "Retirement of directors and appointment to replace the retiring ones"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_92",
        "scenario": "s_corp1014b_nestle",
        "prompt": "The quorum for the meeting was met because",
        "options": [
          "Up to one third of the company's member were in attendance",
          "Up to 25 members were in attendance",
          "Up to 100 persons were in attendance",
          "Quorum was not met because up to half of the members were not present"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_93",
        "scenario": "s_corp1014b_nestle",
        "prompt": "One of the special businesses was to remove Mr. Akindayo Bello as a director. 20 members voted in favour of the resolution while 8 members voted against same. Others refrained from voting. Which of the following is true about the resolution?",
        "options": [
          "The resolution will sail through because it is an Annual General Meeting",
          "The resolution will sail through because it is approved by the majority of members present and voting",
          "The resolution will not sail through because 20 members does not meet the required threshold for a meeting of 100 persons",
          "The resolution will not sail through because 75% majority of members is required"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_94",
        "scenario": "s_corp1014b_nestle",
        "prompt": "The Annual Return form must be filed within",
        "options": [
          "14 days after the AGM was held",
          "15 days after the end of the financial year",
          "42 days of holding the AGM",
          "42 days of sending the notice of AGM"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_95",
        "scenario": "s_corp1014b_nestle",
        "prompt": "One of the following is not entitled to the notice of the AGM",
        "options": [
          "The Company's Debenture Holder",
          "The Company Secretary",
          "The Company's Auditor",
          "Chairman of the Audit Committee"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_96",
        "scenario": "s_corp1014b_standard",
        "prompt": "The accounting records of companies are to be preserved for how many years from the date in which they were made",
        "options": [
          "1 years",
          "5 years",
          "2 years",
          "6 years"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_97",
        "scenario": "s_corp1014b_standard",
        "prompt": "The financial year of the above company must be",
        "options": [
          "December 1 to November 30",
          "January 1 to December 31",
          "January 2 to January 1",
          "January 1 to December 30"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_98",
        "scenario": "s_corp1014b_standard",
        "prompt": "In line with the provisions of the Companies and Allied Matters Act, the financial statements of Standard Bank PLC will be deemed published when",
        "options": [
          "It is submitted to the Central Bank of Nigeria",
          "It is laid before the General Meeting of the company",
          "It is delivered to the Corporate Affairs Commission",
          "B and C"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_99",
        "scenario": "s_corp1014b_standard",
        "prompt": "The following are entitled to the company's financial statement as of right except:",
        "options": [
          "All members of the company",
          "Holders of debenture secured by a fixed charge",
          "Holders of debenture secured by a floating charge",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_100",
        "scenario": "s_corp1014b_standard",
        "prompt": "Failure to deliver a copy of the financial statements of a company to a member who is entitled will",
        "options": [
          "Invalidate the meeting where the financial statements were laid",
          "Not invalidate the meeting where the financial statements were laid",
          "Give rise to liability of the company and every defaulting officer",
          "B and C"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_101",
        "scenario": "s_corp1014b_auditors",
        "prompt": "As held in the case of LIVESTOCK FEEDS PLC V. IGBINO FARMS, the best way of showing the financial position of a company at any given time is through its",
        "options": [
          "Accounting records",
          "Statement of income cash flow",
          "Audited statement of account",
          "Current account"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_102",
        "scenario": "s_corp1014b_meetings",
        "prompt": "A notice to be given in respect of an adjourned meeting is ordinarily not necessary except:",
        "options": [
          "The meeting is going to take place at a new place and time",
          "A new special business is to be transacted at the meeting",
          "The next adjourned date is beyond 20 days",
          "The next adjourned date is beyond 30 days"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_103",
        "scenario": "s_corp1014b_auditors",
        "prompt": "Appointment of first auditors of a company is by",
        "options": [
          "The members in General Meeting",
          "The Board of Directors",
          "The Managing Director",
          "Any of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_104",
        "scenario": "s_corp1014b_auditors",
        "prompt": "At any AGM, a retiring Auditor however appointed shall be automatically re-appointed without any resolution passed unless in all but one of the following instances:",
        "options": [
          "A resolution has been passed at that meeting appointing someone else",
          "He became an officer of the company",
          "He has given the company notice in writing of his unwillingness to be re-appointed",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_105",
        "scenario": "s_corp1014b_auditors",
        "prompt": "The qualification for the appointment of a firm as a company's auditor is:",
        "options": [
          "If the principal partners of the firm are qualified for appointment as auditors",
          "If 50% members of the firm are qualified for appointment as auditors",
          "If and only if all the members of the firm are qualified as auditors",
          "A firm can't be appointed a company's auditor"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_106",
        "scenario": "s_corp1014b_auditors",
        "prompt": "The following persons are absolutely prohibited from appointment as auditors except",
        "options": [
          "An officer of the Company",
          "A body corporate",
          "A firm of auditors",
          "A partner of a servant of the Company"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_107",
        "scenario": "s_corp1014b_auditors",
        "prompt": "Identify the correct position of the law from the options below:",
        "options": [
          "Every company must keep accounting records and have an audit committee",
          "Public companies must keep accounting records and have an audit committee",
          "Every company must keep accounting records and may have an audit committee",
          "Private companies must keep accounting records and have an audit committee"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_108",
        "scenario": "s_corp1014b_auditors",
        "prompt": "One of the following audit committees is not properly constituted:",
        "options": [
          "2 directors and 2 shareholders",
          "3 directors and 3 shareholders",
          "4 directors and 4 shareholders",
          "1 director and 1 shareholder"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_109",
        "scenario": "s_corp1014b_goodlife",
        "prompt": "In filing the annual returns of the above named company, the appropriate form to be filled is:",
        "options": [
          "CAC FORM 10A",
          "CAC FORM 10B",
          "CAC FORM 10C",
          "CAC FORM 10D"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_110",
        "scenario": "s_corp1014b_goodlife",
        "prompt": "All the following facts are true of a small company except:",
        "options": [
          "It is a private company",
          "Its annual turnover for a particular year is not more than ₦2 million naira",
          "None of its members is an alien",
          "Its net value for a particular year is more than ₦1 million but less than ₦2 million"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_111",
        "scenario": "s_corp1014b_goodlife",
        "prompt": "The CAC has inherent powers under Section 525 to strike out the name of a company if:",
        "options": [
          "The company is unable to pay its debt",
          "The company flouts any of the provisions of CAMA",
          "The company is run in an unfairly prejudicial and oppressive manner",
          "The CAC has reasonable cause to believe that the company is not in operation"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_112",
        "scenario": "s_corp1014b_goodlife",
        "prompt": "The time period for filing the annual returns for business name is",
        "options": [
          "Between January 1 and June 30 each year",
          "Between January 1 and July 30 each year",
          "Between June 30 and December 31 each year",
          "Between July 30 and December 31 each year"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_113",
        "scenario": "s_corp1014b_goodlife",
        "prompt": "The stipulated time period for filing of annual returns for Incorporated Trustee is",
        "options": [
          "Between January 1 and June 30 each year",
          "Between January 1 and July 30 each year",
          "Between June 30 and December 31 each year",
          "Between July 30 and December 31 each year"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_114",
        "scenario": "s_corp1014b_minority",
        "prompt": "Which of the following is not a minority protection action under CAMA?",
        "options": [
          "Application to commence derivative action",
          "Application to investigate the affairs of a company",
          "Application against unfairly prejudicial conducts",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_115",
        "scenario": "s_corp1014b_minority",
        "prompt": "The locus classicus for the application of the rule of corporate sovereignty is",
        "options": [
          "Carlil v Carbolic Smoke Ball Co",
          "Foss v Harbottle",
          "Omisade v Akande",
          "Longe v First Bank of Nigeria PLC"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_116",
        "scenario": "s_corp1014b_minority",
        "prompt": "Under section 299 CAMA, where there is a wrong doing against a company, the appropriate party to remedy the wrong doing is the:",
        "options": [
          "Members in General Meeting",
          "The Board of Directors",
          "The Managing Director",
          "Any of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_117",
        "scenario": "s_corp1014b_minority",
        "prompt": "The doctrine of corporate sovereignty connotes that in the management of a company,",
        "options": [
          "Ultimate power belongs to the company through minority members at General Meeting",
          "Ultimate power belongs to the company through majority of members in General Meeting",
          "Ultimate power belongs to the Board of Directors",
          "Ultimate power belongs to the Managing Director and Chairman of the company"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_118",
        "scenario": "s_corp1014b_minority",
        "prompt": "Application for minority protection can be brought by all of the following except:",
        "options": [
          "Writ of summons",
          "Originating motion",
          "Originating Summons",
          "Petition"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_119",
        "scenario": "s_corp1014b_minority",
        "prompt": "One of the following reliefs will not be granted by the Court under Section 303 of CAMA:",
        "options": [
          "An order directing the applicants to sue the directors in the company's name",
          "An order mandating the applicants to sue the company in their personal capacity",
          "An order directing the applicant to sue a named third party in the company's name",
          "None of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_120",
        "scenario": "s_corp1014b_capitalgain",
        "prompt": "Which of the following is not relevant for the prosecution of a suit arising from the above scenario?",
        "options": [
          "Companies Proceeding Rules",
          "Federal High Court Rules",
          "Companies Investigation Rules",
          "Companies Winding up Rules"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_121",
        "scenario": "s_corp1014b_capitalgain",
        "prompt": "Which of the following will adequately address the alleged infraction of minorities' rights by the Managing Director and Chairman?",
        "options": [
          "Derivative Action",
          "Members Direct Action",
          "Representative Action",
          "Third Party Action"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_122",
        "scenario": "s_corp1014b_capitalgain",
        "prompt": "In the action you have identified above, one of the following is not a factor the Court will consider in granting leave to being such action:",
        "options": [
          "The wrongdoers are the directors who are in control and will not take necessary action.",
          "The applicant is acting in good faith",
          "Special resolution of the company authorising the applicant to bring the application",
          "The action appears to be brought in the interest of the company"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_123",
        "scenario": "s_corp1014b_capitalgain",
        "prompt": "The following may apply to the Court under a derivative action as an applicant except:",
        "options": [
          "A registered holder or a beneficial owner and a formal registered holder or beneficial owner of security of the company",
          "A director or an officer or former director or officer of the company",
          "The Corporate Affairs Commission",
          "Any other person who in the discretion of the members is a proper person to make such an application"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_124",
        "scenario": "s_corp1014b_capitalgain",
        "prompt": "The reliefs the court may grant when a petition on the ground of unfairly prejudicial and oppressive conduct is brought includes all except one:",
        "options": [
          "Winding up of the company",
          "Directing a personal action to be brought by the members",
          "Appointment of receiver/manager",
          "Directing investigation to be conducted by CAC"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_125",
        "scenario": "s_corp1014b_jajudet",
        "prompt": "One of these is not a legal mechanism through which Edet may seek protection under the Companies and Allied Matters Act",
        "options": [
          "Derivative Action",
          "Members Direct Action",
          "Investigation of the company by the Securities and Exchange Commission",
          "Application to court for compulsory winding up on just and equitable ground."
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_126",
        "scenario": "s_corp1014b_jajudet",
        "prompt": "The specific application Edet will bring to the courts on grounds of unfairly prejudicial and oppressive conduct is:",
        "options": [
          "Originating Summons",
          "Originating motion",
          "Petition",
          "Writ of summons"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_127",
        "scenario": "s_corp1014b_jajudet",
        "prompt": "A derivative action must be commenced by way of",
        "options": [
          "Originating Summons",
          "Originating motion",
          "Petition",
          "Writ of summons"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_128",
        "scenario": "s_corp1014b_jajudet",
        "prompt": "Assuming Edet intends to bring an action for himself and on behalf of other members of the company; such action must come by way of",
        "options": [
          "Corporate action",
          "Representative action",
          "Committee action",
          "Derivative action"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_129",
        "scenario": "s_corp1014b_jajudet",
        "prompt": "Assuming Edet decides to bring a derivative action, the proper parties before the Court in such an action will be",
        "options": [
          "Jajudet Nigeria Limited and Edet (plaintiffs) v Jane and Judith (defendants)",
          "Jajudet Nigeria Limited and Edet (Plaintiffs) v Jane, Judith and Jajudet Nigeria Ltd (defendants)",
          "Jajudet Nigeria Limited and Edet (Petitioners) v Jane, Judith and Jajudet Nigeria Ltd (Respondents)",
          "Jajudet Nigeria Limited and Edet (Petitioners) v Jane and Judith (Respondents)"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_130",
        "scenario": "s_corp1014b_jajudet",
        "prompt": "The most appropriate court where the action against Jane and Judith can be commenced is",
        "options": [
          "High Court of a State.",
          "Federal High Court",
          "National Industrial Court",
          "Investment and Securities Tribunal"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_131",
        "scenario": "s_corp1014b_soundlight",
        "prompt": "If she decides to bring an action to declare that her rights have been infringed upon and seek an injunction to prevent further infringements, what mode will be most appropriate?",
        "options": [
          "Member's direct action",
          "Derivative action",
          "Petition against unfairly prejudicial and oppressive conduct",
          "Investigation into the affairs of the company"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_132",
        "scenario": "s_corp1014b_soundlight",
        "prompt": "The following are capable of bringing an action for investigating the affairs of a company except",
        "options": [
          "A shareholder having 25% of the total issued shares of the company",
          "The company itself",
          "The Board of Directors of the company",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp1014b_133",
        "scenario": "s_corp1014b_soundlight",
        "prompt": "After carrying out an investigation of a company by an inspector and recording his findings in his report, the following are uses of the report except:",
        "options": [
          "Bring civil proceedings on behalf of the company.",
          "Basis of criminal prosecution by the AGF",
          "Bring winding up petition in respect of the company",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      }
    ]
  },
  {
    "courseId": 4,
    "topicName": "WK 15-16: Company Securities I (Shares, Allotment, and Transfer)",
    "scenarios": [
      {
        "key": "s_corp1516_01",
        "text": "At the recently concluded Extra-Ordinary General Meeting of Great Stark PLC, it was resolved to increase the share capital of the company from N5million to N10 million. The existing shareholders were offered right issues and bonus shares. New members were also invited to purchase the shares of the company. Dr. Jacquelle Zerb of the United States also bought shares.\n\nAnswer the following questions."
      },
      {
        "key": "s_corp1516_02",
        "text": "Hexagon PLC has just made an announcement of a public offer of its shares. The total authorised share capital of the company fully issued and paid up, was increased from N10,000,000 by the creation of additional 20,000,000 ordinary shares of N1 each and 10,000,000 preference shares of N2 each. From the public offer of the shares, a total of 10,000,000 ordinary shares were issued of which 5,000,000 were fully paid up. The whole 10,000,000 preference shares were bought by one Mallam Amino Kano. Payment by Mallam Amino Kano was proposed to be by giving the company his 20 hectares of land located in Victoria Island and erecting a gigantic building on it to be used as the manufacturing site of the company.\n\nAnswer the following questions."
      },
      {
        "key": "s_corp1516_03",
        "text": "Chief Olusoji Ajibade responded to the initial public offer of shares of Forte Oil Plc. and applied for 10,000 ordinary shares at N100 per share and paid in full. Forte Oil PLC after one year of making the offer sent Chief Ajibade a share certificate stating that he has been allotted 6,000 units of shares.\n\nAnswer questions 15-22 using the above scenario."
      },
      {
        "key": "s_corp1516_04",
        "text": "Emardoc Nigeria Ltd was incorporated in 2015 with a total authorised share capital of N100,000 divided into 100,000 ordinary shares of N1 each. Having witnessed stupendous growth in the 5 years of its existence, the company decided to go public. It convened an Extra Ordinary General Meeting on the 1st of December 2019 where resolutions for increasing the share capital to N1,000,000 and re-registering the company as a public company were proposed and duly passed. The new shares created were just ordinary shares to be sold at N2 each.\n\nNow answer the following questions 23-26."
      },
      {
        "key": "s_corp1516_05",
        "text": "Pablo Picasso Nigeria Ltd has just been incorporated in Nigeria with an authorised share capital N1,000,000 divided into 500,000 ordinary shares of N2 each.\n\nAnswer the following questions."
      },
      {
        "key": "s_corp1516_06",
        "text": "Rosemary Akpan sold all her shares in Temple Hill Limited to Isaiah Ehikioya and handed over the share certificate to him. The instrument of transfer was executed by both parties on the 19th of July, 2019. Isaiah Ehikioya gave the instrument of transfer to the company to effect changes in its register of members. On the 10th of August, 2019, the company issued bonus shares to its members and the share certificate for the bonus shares was written in the name of Rosemary Akpan and forwarded to her. Rosemary Akpan now claims to be the lawful owner of the bonus shares.\n\nAnswer the following questions."
      },
      {
        "key": "s_corp1516_07",
        "text": "In 1995, Alhaji Usman Isah bought 10,000,000 shares in Julius Berger Plc, jointly with Mallam Aminu Kwankwaso. Last year, August 2019, Alhaji Isah succumbed to death after a long drawn battle with cancer.\n\nAnswer the following questions."
      }
    ],
    "questions": [
      {
        "scenario": "s_corp1516_01",
        "key": "q_corp1516_01",
        "prompt": "The appropriate method for Great Stark PLC to adopt in order to achieve the aim of issuing its shares to the existing shareholders and at the same time invite new members to subscribe is:",
        "options": [
          "Combined issue",
          "Rights Issue",
          "Placement",
          "Hybrid issue"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_01",
        "key": "q_corp1516_02",
        "prompt": "Assuming all the shares applied for by Dr. Jacquelle Zerb were fully allotted to her, within how many days after the allotment must the letter of allotment be delivered to her?",
        "options": [
          "2 months",
          "3 months",
          "42 days",
          "44 days"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_01",
        "key": "q_corp1516_03",
        "prompt": "The types of shares a company can have under the Companies and Allied Matters Act does not include:",
        "options": [
          "Founders shares",
          "Ordinary shares",
          "Special shares",
          "Preference shares"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_02",
        "key": "q_corp1516_04",
        "prompt": "The total unissued shares of Hexagon PLC from the scenario is",
        "options": [
          "10,000,000 ordinary shares",
          "5,000,000 ordinary shares",
          "5,000,000 ordinary shares and 10,000,000 preference shares",
          "10,000,000 ordinary shares"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_02",
        "key": "q_corp1516_05",
        "prompt": "The total amount of unpaid capital flowing from the increase of the company's share capital is",
        "options": [
          "N5 million",
          "N15 million",
          "N25 million",
          "N10 million"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_02",
        "key": "q_corp1516_06",
        "prompt": "The new authorised share capital of the company by the additional classes of shares created is",
        "options": [
          "N30,000,000",
          "N50,000,000",
          "N40,000,000",
          "N35,000,000"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_02",
        "key": "q_corp1516_07",
        "prompt": "Since the company has agreed to payment for shares in consideration other than cash, within how many days must the company get back to Alhaji Mallam Kano after a valuation report has been submitted by the independent valuer appointed by the company?",
        "options": [
          "7 days",
          "3 months",
          "5 days",
          "3 days"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_02",
        "key": "q_corp1516_08",
        "prompt": "The independent valuer appointed by Hexagon Plc can be all but one of the following",
        "options": [
          "The Company's Auditor",
          "An Estate Surveyor",
          "An External Auditor",
          "An Independent Valuer"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_02",
        "key": "q_corp1516_09",
        "prompt": "The following except one are rights attached to the preference shares bought by Alhaji Mallam Kano",
        "options": [
          "Weighted vote in certain circumstances",
          "Fixed dividends when declared",
          "Priority over ordinary share in payment of dividends",
          "Right to be appointed life director"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_02",
        "key": "q_corp1516_10",
        "prompt": "The presumption on preference shares is that unless otherwise expressly stated in the articles of the company, Preference shares are",
        "options": [
          "Redeemable",
          "Participatory",
          "Non participatory",
          "Cumulative"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_02",
        "key": "q_corp1516_11",
        "prompt": "If in addition to payment of fixed dividends, Mallam Aminu Kano also desires not to be left out in the package of surplus assets of the company, the best type of share that will ensure this is",
        "options": [
          "Cumulative preference shares",
          "Weighted preference shares",
          "Participatory preference shares",
          "Additive preference shares"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_02",
        "key": "q_corp1516_12",
        "prompt": "The type of shares that bear the financial risk of the company is best known as",
        "options": [
          "Founders shares",
          "Ordinary shares",
          "Preference shares",
          "All of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_02",
        "key": "q_corp1516_13",
        "prompt": "The following except one are circumstances provided under Section 143 CAMA where preference shareholders shall have a right to more than one vote per share:",
        "options": [
          "Resolution in respect of preferential dividends in arrears for 12 months",
          "Resolution varying the rights attached to such shares",
          "Resolution as to the removal and appointment of the auditors",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_02",
        "key": "q_corp1516_14",
        "prompt": "The type of shares taken up by promoters of a company and which are cheaper than the other classes of shares is",
        "options": [
          "Deferred shares",
          "Ordinary shares",
          "Founders' shares",
          "A or C"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_03",
        "key": "q_corp1516_15",
        "prompt": "One of these is the legal obligation of Forte Oil PLC when it could not allot all the shares applied for by Chief Olusoji Ajibade:",
        "options": [
          "Write a Letter of Regret to him",
          "Write to inform him of allotment and return of his balance",
          "Write to him a letter of allotment and regret on the un-allotted shares",
          "Write to him a letter of allotment and regret with an enclosed cheque on the un-allotted shares."
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_03",
        "key": "q_corp1516_16",
        "prompt": "The time period stipulated by the law within which Chief Otunba must be notified of the allotment of shares to him is",
        "options": [
          "42 days after the offer was made",
          "42 days after constituting Board Allotment Committee",
          "42 days after approving the allotment",
          "42 days after notifying CAC of the allotment"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_03",
        "key": "q_corp1516_17",
        "prompt": "Forte Oil is expected to deliver the share allotment certificate to Chief Olusoji Ajubade:",
        "options": [
          "Within two months after allotment",
          "Within three months after allotment",
          "Within two months after return on allotment is made to CAC",
          "Within three months after return on allotment is made to CAC"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_03",
        "key": "q_corp1516_18",
        "prompt": "After allotment of shares to Chief Olusoji Ajibade, the company Secretary of Forte Oil PLC is expected to make return on allotment to CAC within",
        "options": [
          "15 days",
          "1 month",
          "14 days",
          "30 days"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_03",
        "key": "q_corp1516_19",
        "prompt": "The appropriate form to be filled for return on allotment is",
        "options": [
          "CAC FORM 2.7",
          "CAC FORM 2.4",
          "CAC FORM 2A",
          "CAC FORM 2.1"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_03",
        "key": "q_corp1516_20",
        "prompt": "Which of the following documents will not accompany the return on allotment form to be filed with CAC?",
        "options": [
          "Special resolution signed by two directors",
          "Evidence of payment of filing fee",
          "Updated annual returns of the company",
          "Updated statement of affairs"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_03",
        "key": "q_corp1516_21",
        "prompt": "A clause in a company's articles which prevents 'newly issued' shares to be offered to members of the public without first being declined by the existing shareholders of the company is:",
        "options": [
          "Right issue",
          "Pre-emptive right",
          "First offer right",
          "First-class right"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_03",
        "key": "q_corp1516_22",
        "prompt": "Assuming immediately after the offer of 10,000 ordinary shares was made by Chief Olusoji Ajibade, he received news of a fire outbreak in his establishment which ruined his investments. If he desires to withdraw his offer of allotment of shares, Chief Olusoji is expected to write the company a letter of:",
        "options": [
          "Regret",
          "Renunciation",
          "Withdrawal",
          "Revocation"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_04",
        "key": "q_corp1516_23",
        "prompt": "With the company's decision to sell the new shares at N2 each, the company is said to be issuing shares:",
        "options": [
          "At the nominal price",
          "At a discount",
          "At a premier",
          "At a premium"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_04",
        "key": "q_corp1516_24",
        "prompt": "Assuming Emardoc Nigeria PLC decides to issue the shares at a discount, one of the following is not a condition precedent:",
        "options": [
          "Resolution passed specifying the maximum rate of discount",
          "Application is made to the Federal High Court for sanctioning",
          "Application is made to the Securities and Exchange Commission for sanctioning",
          "The discounted shares are issued within one month after being sanctioned"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_04",
        "key": "q_corp1516_25",
        "prompt": "Assuming Emardoc Nigeria PLC has a surge in its share premium account, which of the following is not a function of the account?",
        "options": [
          "Paying up right issue to the directors of the company",
          "Writing off preliminary expenses of the company",
          "Paying up bonus issue to members of the company",
          "Paying for commission and discount allowed"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_04",
        "key": "q_corp1516_26",
        "prompt": "Tatiana Johnson responded to the company's call and purchased 2,000 ordinary shares. However, for more than 6 months she hasn't been given a copy of the share certificate despite repeated demands. She has decided to commence an action in the Federal High Court to compel the company to deliver the share certificate. The appropriate method of commencement of the action is by",
        "options": [
          "Writ of summons",
          "Originating Summons",
          "Originating motion",
          "Petition"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_05",
        "key": "q_corp1516_27",
        "prompt": "Pablo Picasso Nigeria Ltd has just been incorporated in Nigeria with an authorised share capital N1,000,000 divided into 500,000 ordinary shares of N2 each. One of the following is correct about the company",
        "options": [
          "No transfer of shares is effective until an instrument of transfer has been executed",
          "No transfer of shares is effective until such transfer has been consented to by the directors",
          "The company can never have more than 50 members under any circumstance",
          "The age of the directors must never be over 70 years"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_05",
        "key": "q_corp1516_28",
        "prompt": "All but one of the following shares can be allowed in Pablo Picasso Nigeria Ltd",
        "options": [
          "Non-voting shares",
          "Weighted shares",
          "Non-cumulative preference shares",
          "Non-participating preference shares"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "key": "q_corp1516_29",
        "prompt": "The following except one are valid restrictions on the transfer of shares of a company:",
        "options": [
          "Where the shares are not fully paid up",
          "Where the memorandum of association restricts its transferability",
          "Where the articles of association restricts its transferability",
          "Where there is lien of the shares"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_06",
        "key": "q_corp1516_30",
        "prompt": "The period provided under the Companies and Allied Matters Act for share certificate to be delivered to Isaiah Ehikioya after the transfer is",
        "options": [
          "1 month",
          "2 months",
          "3 months",
          "4 months"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_06",
        "key": "q_corp1516_31",
        "prompt": "The following are remedies available to Isaiah Ehikioya in this circumstance except:",
        "options": [
          "Serve on the company a notice and affidavit of interest in the company's shares",
          "Apply to Federal High Court to rectify the company's register of members in his favour",
          "Action against Rosemary Akpan to account for the benefits derived",
          "Petition for winding up on the company"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_06",
        "key": "q_corp1516_32",
        "prompt": "The following are methods of offering shares in the Nigerian Capital market except?",
        "options": [
          "Direct offer",
          "Offer for sale",
          "Placement",
          "Purchase and Assumption"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_07",
        "key": "q_corp1516_33",
        "prompt": "By the provisions of CAMA, the 10,000,000 shares shall become that of?",
        "options": [
          "Alhaji Isah's Beneficiaries",
          "Mallam Kwankwaso as a joint holder",
          "Mallam Kwankwaso by transfer",
          "Personal Representatives of Alhaji Isah"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_07",
        "key": "q_corp1516_34",
        "prompt": "If the shares were purchased by Alhaji Isah as a sole holder, the person entitled to be registered as the Shareholder is?",
        "options": [
          "Mallam Kwankwaso",
          "Alhaji Isah's survivor",
          "A beneficiary named in Alhaji Isah's Will",
          "Personal Representative of Alhaji Isah"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_07",
        "key": "q_corp1516_35",
        "prompt": "Assuming Alhaji Isah wrote a Will and named Musa Marwa as the beneficiary of the shares, the option available to Musa is?",
        "options": [
          "An action in Court",
          "To petition the CAC",
          "To serve on the Company a notice and affidavit of interest",
          "Any of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516_07",
        "key": "q_corp1516_36",
        "prompt": "Assuming Musa Marwa fails to make any election either to be registered as a member of the company or to transfer the shares to another person, within how many days after notice of election is given him by the Board of Directors and his failure to comply will rights attached to such shares be withheld from him?",
        "options": [
          "90 days",
          "60 days",
          "30 days",
          "15 days"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "key": "q_corp1516_37",
        "prompt": "Allotment of shares to the existing shareholders in the proportion of their existing shareholding for which the company will pay for such shares allotted is:",
        "options": [
          "Giveaway",
          "Right issue",
          "Pre-emptive right issue",
          "Bonus issue"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "key": "q_corp1516_38",
        "prompt": "The following statements are true in respect of bonus shares except:",
        "options": [
          "Payment for bonus shares can be made from the capital redemption reserve fund",
          "Payment for bonus shares can be made from the share premium account",
          "Bonus shares are issued to members of the company in the proportion of their shareholding",
          "Payment for bonus shares can be made from the sinking account"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "key": "q_corp1516_39",
        "prompt": "The preference shareholders can have any of the following rights except",
        "options": [
          "Right to accumulate dividends at a fixed rate when dividends have not been declared",
          "Right to participate in the distribution of the company's assets after creditors have been settled",
          "Right to more than one vote in certain circumstances",
          "Right to appoint at least one director"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "key": "q_corp1516_40",
        "prompt": "A share is considered weighted when:",
        "options": [
          "It carries more than one vote",
          "It is in higher demand than other shares",
          "More shareholders have that class of shares",
          "It is more expensive than others."
        ],
        "correct": 0,
        "explanation": ""
      }
    ]
  },
  {
    "courseId": 4,
    "topicName": "WK 15-16: Company Securities II (Debentures, Charges, Capital Market, and Bonds)",
    "scenarios": [
      {
        "key": "s_corp1516b_01",
        "text": "Oaklane Advisory PLC has been experiencing financial difficulties in recent times. Convinced that access to more capital will revive the company, the Board of Directors passed a resolution to approach First Bank of Nigeria PLC for a loan to the tune of N10 million. The company despite the loan wants unrestricted use of its assets.\n\nAnswer the following questions."
      },
      {
        "key": "s_corp1516b_02",
        "text": "Hemshire Nigeria Ltd desires to raise more capital to finance its business. The company was incorporated with an authorised share capital of N200,000 but desires to raise more money from the public through public offer of its shares.\n\nAnswer the following questions 56-61."
      },
      {
        "key": "s_corp1516b_03",
        "text": "In a bid to develop into a megacity, the Lagos state government is exploring the options of raising N50billion by issuing bonds to the investing public.\n\nAnswer the following questions."
      }
    ],
    "questions": [
      {
        "key": "q_corp1516b_41",
        "prompt": "The rights of a shareholder include all of the following except:",
        "options": [
          "To attend meetings of the Board of Directors",
          "To be elected a member of the audit committee",
          "To vote by show of hand",
          "To propose resolutions"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_42",
        "prompt": "Every company shall within ______ after the allotment of its debentures, deliver to the holder a certificate of debenture under the common seal of the company",
        "options": [
          "21 days",
          "42 days",
          "60 days",
          "90 days"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_43",
        "prompt": "Every charge created by a company that is not registered within the prescribed days after the creation of the charge is void against",
        "options": [
          "The liquidator and any creditor of the company",
          "Against the liquidator only",
          "Any creditor of the company only",
          "The chargee"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_44",
        "prompt": "The type of debenture created with the intention that it will not be redeemed or it will only be redeemed upon the happening of a remote event or contingency is",
        "options": [
          "Contingency debenture",
          "Perpetual debenture",
          "Convertible debenture",
          "Bearer debenture"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_45",
        "prompt": "One of these debentures is most appropriate for a debenture holder who wishes to be a shareholder of the company.",
        "options": [
          "Bearer Debenture",
          "Perpetual Debenture",
          "Convertible Debenture",
          "Registered Debenture"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_46",
        "prompt": "Generally, debentures can be secured by all the following except",
        "options": [
          "Fixed charge",
          "Floating charge",
          "All of the above",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_01",
        "key": "q_corp1516b_47",
        "prompt": "The most effective way to secure the charge that will help the company fulfil its desire is",
        "options": [
          "A fixed charge",
          "A floating charge",
          "A syndicate charge",
          "None of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_01",
        "key": "q_corp1516b_48",
        "prompt": "Registration of the charge created by Oaklane Advisory PLC to secure the loan provided by First Bank of Nigeria PLC must be done at CAC within how many days of creating the charge?",
        "options": [
          "60 days",
          "90 days",
          "30 days",
          "3 months"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_01",
        "key": "q_corp1516b_49",
        "prompt": "The form for registering the charge is:",
        "options": [
          "CAC FORM 9",
          "CAC FORM 7",
          "CAC FORM 8",
          "CAC FORM 10"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_01",
        "key": "q_corp1516b_50",
        "prompt": "Within how many days of the conclusion of the agreement to be a debenture must the name of First Bank of Nig. PLC be entered into the register of debenture holders by Oaklane Advisory PLC?",
        "options": [
          "15 days",
          "20 days",
          "25 days",
          "30 days"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_01",
        "key": "q_corp1516b_51",
        "prompt": "The documents expected to be kept by Oaklane Advisory PLC upon the issue of debenture to First Bank of Nigeria PLC do not include:",
        "options": [
          "Register of charges",
          "Register of debts and loans",
          "Records of instruments creating charges",
          "Register of debenture holders"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_01",
        "key": "q_corp1516b_52",
        "prompt": "Upon default by Oaklane Advisory PLC to repay the principal sum and interest on the fixed date, the remedies available to First Bank include all but one of the following:",
        "options": [
          "Petition for creditor's voluntary winding up of the company",
          "Petition for compulsory winding up of the company",
          "Action in court to recover the principal sum and interest",
          "Appointment of receiver/manager over the company"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_01",
        "key": "q_corp1516b_53",
        "prompt": "A floating charge shall crystallize on assets of a company when all but one of the following occurs:",
        "options": [
          "The security becomes enforceable and the holder appoints a receiver or manager to enter into possession of such assets",
          "The court appoints a receiver or manager of such assets on application of the holder",
          "The company goes into liquidation",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_54",
        "prompt": "Sale of shares by shareholders is done at the",
        "options": [
          "Primary market",
          "Secondary market",
          "All of the above",
          "None of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_55",
        "prompt": "A participant in collective investment scheme is best described as:",
        "options": [
          "A shareholder",
          "A stakeholder",
          "Debenture holder",
          "Unit holder"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_02",
        "key": "q_corp1516b_56",
        "prompt": "The first step Hemshire Nigeria Ltd must take to be able to carry out its wishes is",
        "options": [
          "Increase its share capital to at least N500,000",
          "Re-register as a public company",
          "Offer its shares to certain members of the public through private placement",
          "Seek permission from Securities and Exchange Commission"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_02",
        "key": "q_corp1516b_57",
        "prompt": "Assuming Hemshire Nigeria Ltd has been converted to a public company; the process of issuing its shares to members of the company for the first time is called:",
        "options": [
          "First time offer",
          "Public offering of shares",
          "Initial public offer",
          "Direct public offer"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_02",
        "key": "q_corp1516b_58",
        "prompt": "The money raised from the issue of shares you have identified in 57 above goes to",
        "options": [
          "The Issuing Houses",
          "The Board of Directors",
          "The Shareholders",
          "The Company"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_02",
        "key": "q_corp1516b_59",
        "prompt": "Assuming Hemshire Nigeria PLC wants to dispense with the issue of prospectus in offering its shares to the public, what step should it take?",
        "options": [
          "Apply for exemption from the Securities and Exchange Commission",
          "File statements in lieu of prospectus",
          "File statement in lieu of prospectus signed by all the named directors",
          "Prospectus is a mandatory requirement which cannot be dispensed with."
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_02",
        "key": "q_corp1516b_60",
        "prompt": "Assuming Hemshire Nigeria PLC submitted application for the registration of prospectus and SEC refuses to register, Hemshire should appeal against the refusal to:",
        "options": [
          "Corporate Affairs Commission",
          "Appellate Body of SEC",
          "Federal High Court",
          "Investments and Securities Tribunal"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_02",
        "key": "q_corp1516b_61",
        "prompt": "Within how many days after notification of refusal must Hemshire Nig. Plc appeal to the appropriate body?",
        "options": [
          "14 days",
          "21 days",
          "7 days",
          "42 days"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_62",
        "prompt": "The method of offer of securities to the public where a company issues its shares through an issuing house which acts as the agent of the company but does not bear the risk of failure of offer is",
        "options": [
          "Offer for sale",
          "Direct offer",
          "Private placement",
          "Placing"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_63",
        "prompt": "The method of offer of securities to the public where a company sells its securities to an issuing house and the latter bears the risk of failure of offer is",
        "options": [
          "Offer for sale",
          "Direct offer",
          "Private placement",
          "Placing"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_64",
        "prompt": "Which of the following companies can offer its shares to certain members of the public through private placement?",
        "options": [
          "Quoted public companies",
          "Private companies",
          "Unquoted public companies",
          "B and C"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_65",
        "prompt": "The issue of shares by a company, which is directed only to existing shareholders who are expected to acquire the shares in the ratio at which they hold shares in the company, is:",
        "options": [
          "Pre-emptive issue",
          "Right issue",
          "Shareholders issue",
          "Hybrid issue"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_66",
        "prompt": "The form for the registration of securities with the Securities and Exchange Commission is",
        "options": [
          "Form SEC 3",
          "Form SEC 4",
          "Form SEC 5",
          "Form SEC 6"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_67",
        "prompt": "None but one of the following is not a capital market operator",
        "options": [
          "Issuing houses",
          "Solicitors",
          "Underwriters",
          "Custodians"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_68",
        "prompt": "All but one of the following are capital market consultants",
        "options": [
          "Registrars",
          "Estate Valuers",
          "Accountants",
          "Auditors"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_03",
        "key": "q_corp1516b_69",
        "prompt": "One of these bodies cannot issue government bonds under the Investment and Securities Act:",
        "options": [
          "Federal government agency",
          "State government and local government",
          "State government agencies",
          "Public companies where government has shares"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_03",
        "key": "q_corp1516b_70",
        "prompt": "The maximum redemption date for issued bonds is:",
        "options": [
          "20 years from the date of issue of the bond",
          "50 years from the date of issue of the bond",
          "25 years from the date of issue of the bond",
          "30 years from the date of issue of the bond"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_03",
        "key": "q_corp1516b_71",
        "prompt": "The bond issued by the Lagos State government is called",
        "options": [
          "Municipal bond",
          "Sovereign bond",
          "Revenue bond",
          "State bond"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_03",
        "key": "q_corp1516b_72",
        "prompt": "The following except one are conditions to be fulfilled before the Lagos state government can validly issue the bond",
        "options": [
          "The existence of an enabling law for which the authority to issue the bond is derived",
          "The bond instrument must bear the crest of the state government",
          "The bond instrument must be registered with CAC",
          "The bond instrument must be registered with SEC"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_03",
        "key": "q_corp1516b_73",
        "prompt": "The essential document which guarantees the repayment of the bonds issued by Lagos state at the due date is:",
        "options": [
          "Irrevocable letter of authority by the Auditor-General of the State",
          "Irrevocable letter of authority by the Accountant-General of the State",
          "Irrevocable letter or its waiver issued by the Accountant General of the Federation",
          "None of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1516b_03",
        "key": "q_corp1516b_74",
        "prompt": "The time limit within which bond certificates must be issued to bondholders after the issue of bonds is",
        "options": [
          "2 months",
          "3 months",
          "4 months",
          "6 months"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_75",
        "prompt": "The Nigerian Stock Exchange is:",
        "options": [
          "A statutory corporation",
          "An incorporated trustee",
          "An incorporated company limited by guarantee",
          "A public limited company"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_76",
        "prompt": "Every collective investment scheme must be registered with:",
        "options": [
          "Corporate Affairs Commission",
          "Securities and Exchange Commission",
          "Investments and Securities Commission",
          "Nigerian Stock Exchange"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_77",
        "prompt": "The management of the resources pooled together in a collective investment scheme is usually the function of the",
        "options": [
          "Board of Directors of the scheme",
          "Participants of the scheme",
          "Shareholders",
          "Fund manager"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_78",
        "prompt": "The document that regulates the relationship of participants in a collective investment scheme is",
        "options": [
          "Memorandum of Association",
          "Articles of Association",
          "Partnership Agreement",
          "Trust Deed"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_79",
        "prompt": "The minimum paid up capital required of a fund manager of an investment scheme is:",
        "options": [
          "N50,000,000",
          "N10,000,000",
          "N20,000,000",
          "N15,000,000"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "key": "q_corp1516b_80",
        "prompt": "The minimum paid up capital required of a body corporate acting as trustee of a collective investment scheme is:",
        "options": [
          "N40,000,000",
          "N20,000,000",
          "N10,000,000",
          "N15,000,000"
        ],
        "correct": 1,
        "explanation": ""
      }
    ]
  },
  {
    "courseId": 4,
    "topicName": "WK 17-18: Corporate Restructuring (Mergers, Acquisitions, and Takeovers)",
    "scenarios": [
      {
        "key": "s_corp1718_01",
        "text": "Honeywell Solution PLC has been in great financial difficulties for more than 2 years. It has not declared dividends for the past 2 years and has not redeemed its debentures that are due. The company however is still equipped with assets, although less than its total liabilities. The company has come to you for advice on the best restructuring option to undertake which will still make the company a going concern.\n\nAnswer questions 1-3."
      },
      {
        "key": "s_corp1718_02",
        "text": "At the general meeting of SugarBliss Nig Ltd, a company with no alien participation, held on the 30th day of March, 2020, the members of the company passed a special resolution for the voluntary winding up of the company. It also resolved that a liquidator be appointed to sell off the whole undertakings to another company for a consideration of fully paid up shares in the other company. The company's directors also made a statutory declaration of solvency.\n\nAnswer questions 4-9."
      },
      {
        "key": "s_corp1718_03",
        "text": "Ohanezecom (Nig.) Plc and Arewacom (Nig.) Plc are two of the newly licensed telecom service providers in Nigeria. With a combined networth of ₦490 million, the two companies have concluded a merger arrangement in view of the threats from older telecommunication companies operating in Nigeria. They have secured the consent of the Corporate Affairs Commission (CAC) to use the name Oharewacom (Nig.) Plc.\n\nAnswer questions 15-17."
      },
      {
        "key": "s_corp1718_04",
        "text": "Confluence Cement Plc and Nagode Cement (Nig) Plc are rival companies in the lucrative cement business sector of the Nigerian economy. But they are the only companies in the sector. A bitter boardroom crisis among the directors has impacted negatively on the business of Nagode Cement (Nig.) Plc. The takeover bid made by Confluence Cement Plc was rejected by the highly polarized board of Nagode (Nig) Plc.\n\nAnswer questions 18-26."
      },
      {
        "key": "s_corp1718_05",
        "text": "Foster Airways have concluded merger talks with Bitcoin Airways. The net worth of the two companies is ₦1 billion. The two companies desire to adopt a new corporate name: FosterBits Airways after the merger.\n\nAnswer questions 27-30."
      },
      {
        "key": "s_corp1718_06",
        "text": "Great Stark Insurance PLC is one of the big fishes in the insurance industry in Nigeria. In order to maintain its position, the company seeks to acquire 20% ownership stake of Hulk Insurance PLC.\n\nAnswer questions 31-36."
      },
      {
        "key": "s_corp1718_07",
        "text": "Bobo Flour Mill Plc is an indigenous company which engages in manufacturing of flours and confectionaries with authorized share capital and asset base worth ₦400 million Naira. As a result of low sale and stiff competition, the company has resolved at its board meeting held on 1st August, 2019 to combine its business with Manna Superbag Plc, a company which engages in production and manufacturing of package bags with authorized share capital and asset base worth ₦200 million.\n\nAnswer questions 39-41."
      }
    ],
    "questions": [
      {
        "scenario": "s_corp1718_01",
        "key": "q_corp1718_01",
        "prompt": "Which is the best restructuring option for Honeywell Solution PLC to undertake which will still make the company a going concern?",
        "options": [
          "Arrangement and compromise",
          "Arrangement on sale",
          "Management buy in",
          "Takeover bid"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_01",
        "key": "q_corp1718_02",
        "prompt": "Assuming Honeywell Solution PLC opted for the option of arrangement and compromise, which of the following regulatory bodies will not be involved in the process?",
        "options": [
          "Federal High Court",
          "Securities and Exchange Commission",
          "Corporate Affairs Commission",
          "Nigerian Stock Exchange"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_01",
        "key": "q_corp1718_03",
        "prompt": "All but one of the following is correct about arrangement and compromise:",
        "options": [
          "It must be sanctioned by the court to be valid",
          "Special resolution of the class affected is required",
          "It is most suitable when a company is solvent",
          "SEC must investigate its fairness before sanctioning"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_02",
        "key": "q_corp1718_04",
        "prompt": "Which of the following corporate restructuring is best described by the above scenario?",
        "options": [
          "Creditors' voluntary winding up",
          "Arrangement and compromise",
          "Arrangement on sale",
          "Merger"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_02",
        "key": "q_corp1718_05",
        "prompt": "As the solicitor to SugarBliss Nigeria Ltd, your principal was invited to the General meeting and was asked to give a list of internal restructuring options available to the company which do not include:",
        "options": [
          "Management buy out",
          "Management buy in",
          "Arrangement on sale",
          "Arrangement and compromise"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_02",
        "key": "q_corp1718_06",
        "prompt": "Assuming in the restructuring option you identified in question 4 above, Kosi Udeh, who is a dissenting member, decides to take a step in making sure that either the resolution is not effected or his shares in the company are bought, within how many days after passing of the resolution must he give notice of such decision?",
        "options": [
          "14 days",
          "21 days",
          "28 days",
          "30 days"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_02",
        "key": "q_corp1718_07",
        "prompt": "The notice is addressed to:",
        "options": [
          "The Board of Directors",
          "The Company Secretary",
          "The Liquidator appointed",
          "The Company"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_02",
        "key": "q_corp1718_08",
        "prompt": "If eventually, it is agreed to purchase the shares of Kosi Udeh, the price of the shares shall be determined by?",
        "options": [
          "Agreement of the parties",
          "Securities and Exchange Commission",
          "Federal High Court",
          "Independent valuer appointed by Securities and Exchange Commission"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_02",
        "key": "q_corp1718_09",
        "prompt": "If Udeh Kosi were to be an American, then the price of the shares will be determined by?",
        "options": [
          "Agreement of the parties",
          "Securities and Exchange Commission",
          "Federal High Court",
          "Independent valuer appointed by SugarBliss Nigeria Ltd"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "key": "q_corp1718_10",
        "prompt": "Which of the following modes of corporate restructuring will not require the sanction of the court for its validity?",
        "options": [
          "Arrangement and compromise with creditors",
          "Arrangement and compromise with a class of members",
          "Arrangement and compromise with members generally",
          "Arrangement on sale"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "key": "q_corp1718_11",
        "prompt": "The acquisition by the management team of a company of controlling shares of that company or its subsidiaries with or without third party financing is what form of corporate restructuring?",
        "options": [
          "Stakeholders buy out",
          "Stakeholders buy in",
          "Management buy out",
          "Management buy in"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "key": "q_corp1718_12",
        "prompt": "None of the following about statutory declaration of solvency is incorrect except:",
        "options": [
          "It is made within five (5) weeks preceding passing of the resolution for voluntary winding up of the company.",
          "It is made by the Board of Directors.",
          "It embodies a statement of the Company's assets and liabilities.",
          "The directors of the company are of the opinion that the company will be able to pay its debts in full within 18 months from the commencement of the winding up."
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "key": "q_corp1718_13",
        "prompt": "The apex regulatory body of the Nigerian capital market is:",
        "options": [
          "Securities and Exchange Commission",
          "The Nigeria Stock Exchange",
          "The Central Bank of Nigeria",
          "Corporate Affairs Commission"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "key": "q_corp1718_14",
        "prompt": "What is the full meaning of FCCPC?",
        "options": [
          "Federal Commission on Consumer Protection and Competition",
          "Federal Commission on Competition and Protection of Consumers",
          "Federal Competition and Commission for Protection of Consumers",
          "Federal Competition and Consumer Protection Commission"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_03",
        "key": "q_corp1718_15",
        "prompt": "The merger of Ohanezecom (Nig) Plc and Arewacom (Nig.) Plc is in the ______ category by virtue of the FCCPC Act.",
        "options": [
          "Intermediate",
          "Small",
          "Large",
          "Mega"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_03",
        "key": "q_corp1718_16",
        "prompt": "The merger of the two companies is an example of what type of merger?",
        "options": [
          "Horizontal merger",
          "Vertical merger",
          "Conglomerate merger",
          "Pure conglomerate merger"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_03",
        "key": "q_corp1718_17",
        "prompt": "The two types of due diligence each company is expected to make before the consummation of the merger is:",
        "options": [
          "Corporate and Legal",
          "Legal and Investment",
          "Legal and Financial",
          "Business and Investment"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_04",
        "key": "q_corp1718_18",
        "prompt": "Which of the following restructuring options is not legally permissible between the two companies above?",
        "options": [
          "Merger",
          "Takeover",
          "Management-Buy-in",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_04",
        "key": "q_corp1718_19",
        "prompt": "Which of the following options is available to Confluence Cement Plc in respect of the rejected Take-over bid?",
        "options": [
          "Explore the possibility of a violent Takeover.",
          "Apply to the court for an Order of Mandamus.",
          "Apply to CAC to investigate Nagode Cement Plc.",
          "None of the above."
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_04",
        "key": "q_corp1718_20",
        "prompt": "By the provisions of the Investments and Securities Act, 2007, the Take-over Bid by Confluence Cement Plc must target at least:",
        "options": [
          "25% of its total shares.",
          "30% of its total shares.",
          "40% of its total shares.",
          "50% of its total shares."
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_04",
        "key": "q_corp1718_21",
        "prompt": "Assuming the net worth of the two Companies above is N6 Billion and they have agreed to Merge, which of the following will be the appropriate category for the Merger?",
        "options": [
          "Small.",
          "Intermediate",
          "Large",
          "Conglomerate"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_04",
        "key": "q_corp1718_22",
        "prompt": "All but one of the following are the three major steps in the procedure for a large Merger:",
        "options": [
          "Pre-Merger Notification to FCCPC",
          "Formal Approval of merger",
          "Post Approval Notification to FCCPC",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_04",
        "key": "q_corp1718_23",
        "prompt": "Within how many days must the copy of the special resolution of the companies approving the merger be filed with the Corporate Affairs Commission?",
        "options": [
          "14 days",
          "21 days",
          "15 days",
          "7 days"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_04",
        "key": "q_corp1718_24",
        "prompt": "Within how many days of sanctioning the scheme of merger by the Court must notice of such be given to the Corporate Affairs Commission?",
        "options": [
          "7 days",
          "21 days",
          "14 days",
          "15 days"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_04",
        "key": "q_corp1718_25",
        "prompt": "What is the time frame within which post-merger notification must be given to the appropriate body after completing the merger?",
        "options": [
          "Within 2 months",
          "Within 3 months",
          "Within 4 months",
          "Within 5 months"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_04",
        "key": "q_corp1718_26",
        "prompt": "Assuming the boardroom crisis of Nagode Cement (Nig.) Plc has grounded its operations for the past two years, which of the following options is most suitable if Confluence Cement Plc is still interested in acquiring Nagode Cement Plc as a Moribund Company?",
        "options": [
          "Arrangement or Compromise",
          "Arrangement on Sale",
          "Purchase and Assumption",
          "Merger"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_05",
        "key": "q_corp1718_27",
        "prompt": "In view of the net worth of the companies, which of the following options will best describe the type of merger according to the SEC Rules?",
        "options": [
          "Small Merger",
          "Intermediate Merger",
          "Large Merger",
          "None of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_05",
        "key": "q_corp1718_28",
        "prompt": "The proposed merger is a good example of:",
        "options": [
          "Horizontal merger",
          "Vertical merger",
          "Conglomerate merger",
          "Pure conglomerate merger"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_05",
        "key": "q_corp1718_29",
        "prompt": "Which of the following regulatory bodies will not be involved in the proposed merger?",
        "options": [
          "Securities and Exchange Commission",
          "Corporate Affairs commission",
          "Nigeria Civil Aviation Authority",
          "Central Bank of Nigeria"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_05",
        "key": "q_corp1718_30",
        "prompt": "The proposed new name for the merger must be approved by:",
        "options": [
          "Corporate Affairs Commission",
          "Nigerian Investment Promotion Commission",
          "Nigerian Civil Aviation Authority",
          "Federal High Court"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_06",
        "key": "q_corp1718_31",
        "prompt": "The most appropriate mode of corporate restructuring practiced by Great Stark Insurance PLC is?",
        "options": [
          "Acquisition",
          "Merger",
          "Take-over",
          "Purchase and Assumption"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_06",
        "key": "q_corp1718_32",
        "prompt": "Assuming Great Stark PLC decides to buy 51% ownership stake in Hulk Insurance PLC, then it would be:",
        "options": [
          "Acquisition",
          "Merger",
          "Take-over",
          "Purchase and Assumption"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_06",
        "key": "q_corp1718_33",
        "prompt": "Assuming the two companies have agreed on a take-over, the authority to proceed with a take-over is granted by:",
        "options": [
          "Director of offeror",
          "Director of offeree",
          "Securities and Exchange Commission",
          "Corporate Affairs Commission"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_06",
        "key": "q_corp1718_34",
        "prompt": "The authority to proceed with a take-over remains in force for:",
        "options": [
          "3 months",
          "2 months",
          "1 month",
          "6 months"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_06",
        "key": "q_corp1718_35",
        "prompt": "The definition of a dissenting member in a take-over bid includes all but one of the following:",
        "options": [
          "Those who refused the offer",
          "Those who neither accepted nor rejected the offer",
          "Those who having accepted the offer and still fail or refuse to transfer their shares to the offeror.",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_06",
        "key": "q_corp1718_36",
        "prompt": "The shares of a dissenting member during a take-over bid may be acquired if offerees holding not less than _____ accept the offer.",
        "options": [
          "90% in number of shares",
          "75% in number of shares",
          "50% in number of shares",
          "60% in number of shares"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "key": "q_corp1718_37",
        "prompt": "The corporate restructuring option where a company is allowed to inspect the books, assets, business operations/activities of a failing company with a view to choosing or picking out those aspects it could save by integrating them into its own business activities is:",
        "options": [
          "Purchase and Assumption",
          "Cherry Picking",
          "Management buy in",
          "Auctioneering"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "key": "q_corp1718_38",
        "prompt": "One of the following categories of mergers has been abolished by the Federal Consumers Protection and Competition Commission Act 2019:",
        "options": [
          "Small merger",
          "Intermediate merger",
          "Large merger",
          "None of the above"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_07",
        "key": "q_corp1718_39",
        "prompt": "Which of the merger options below will be suitable to describe the business combination of the two companies?",
        "options": [
          "Vertical merger",
          "Horizontal merger",
          "Conglomerate merger",
          "Consolidation merger"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_07",
        "key": "q_corp1718_40",
        "prompt": "Which of the following regulatory bodies will supervise and regulate the business combination of the two parties?",
        "options": [
          "Corporate Affairs Commission",
          "Securities and Exchange Commission",
          "Federal High Court",
          "All of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp1718_07",
        "key": "q_corp1718_41",
        "prompt": "As part of the documentation to be submitted to Securities and Exchange Commission for the registration of the business combination of the 2 companies, the following items will be submitted except:",
        "options": [
          "Scheme of merger",
          "Special resolution of the two companies approving the merger",
          "CTC of court order sanctioning the merger.",
          "Notice of meeting (Extra Ordinary general meeting) of the two companies for the consideration of the resolution."
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "key": "q_corp1718_42",
        "prompt": "Tozal Oil & Gas Limited has recently run into some liquidity issues. The company is experiencing some difficulty in discharging its liabilities which have now fallen due. The company desires to remain a going concern. Which of the following restructuring options will not help the company out of its situation?",
        "options": [
          "Arrangement on sale",
          "Arrangement and compromise",
          "Increase of share capital",
          "Takeover"
        ],
        "correct": 0,
        "explanation": ""
      }
    ]
  },
  {
    "courseId": 4,
    "topicName": "WK 19: Companies Proceedings and Investment Disputes Resolution",
    "scenarios": [
      {
        "id": "s_corp19_akinpawpaw",
        "key": "akinpawpaw",
        "text": "Akinpawpaw (Nig.) Plc is a Company licensed by Nigerian Government for the production of telecommunications equipment and recharge cards in January, 2010. The company at its last Annual General Meeting held at its registered address in the Federal Capital Territory announced to its members that it had met the listing requirements on the floor of the Nigerian Stock Exchange."
      },
      {
        "id": "s_corp19_adago-smith",
        "key": "adago-smith",
        "text": "Adago Smith owns a lot of shares in several companies listed at the stock exchange. Her Stockbroker - Kolade manages the shares purchased and sells on her behalf."
      },
      {
        "id": "s_corp19_oluwaglass",
        "key": "oluwaglass",
        "text": "At the Annual General Meeting of Oluwaglass Nigeria PLC, a dispute ensued between one of the directors of the company, Mr. Agbalumo and a shareholder, Mr. Opeyinbo. In the course of the dispute, both parties started exchanging words and suddenly, Mr. Opeyinbo called Mr. Agbalumo a pig who is only good at sleeping with other men's wives. Mr. Agbalumo was furious and threatened to bring a defamation suit against Mr. Opeyinbo."
      }
    ],
    "questions": [
      {
        "id": "q_corp19_1",
        "prompt": "Exclusive jurisdiction on company proceedings and administration under the Companies and Allied Matters Act is vested with:",
        "options": [
          "Investment and Securities Tribunal",
          "Federal High Court",
          "States High Court",
          "Court of Appeal"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp19_2",
        "prompt": "By the provision of the Company Proceedings Rules of 1992, the default mode of commencement of action in corporate litigation is by:",
        "options": [
          "Petition",
          "Originating motion",
          "Originating summons",
          "Originating applications"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp19_3",
        "prompt": "Application for the rectification of a company's register of members must be brought by way of:",
        "options": [
          "Originating motion",
          "Originating Summons",
          "Petition",
          "Writ of summons"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp19_4",
        "prompt": "Which of the following is an invalid service of court processes on a company?",
        "options": [
          "Service on the company Secretary",
          "Service on the Director of the Company",
          "Leaving the documents at the registered office of the company",
          "Service on the head of security of the company"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp19_5",
        "prompt": "Application to sanction the issue of a company's shares at a discount is to be brought before the Federal High Court by way of:",
        "options": [
          "Petition",
          "Originating motion",
          "Originating summons",
          "Writ of summons"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp19_6",
        "prompt": "The Administrative Proceedings Committee of SEC is a body established pursuant to:",
        "options": [
          "Companies and Allied Matters Act",
          "Investment and Securities Tribunal Act",
          "Investment and Securities Act",
          "Securities and Exchange Commission Rules"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp19_7",
        "prompt": "Any party who is not satisfied with the decision of the Administrative Proceedings Committee as confirmed by SEC may within _____ of the receipt of the decision appeal to the appropriate body:",
        "options": [
          "1 month",
          "28 days",
          "21 days",
          "30 days"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp19_8",
        "prompt": "The appropriate body to which an appeal lies from the decision of the Administrative Proceedings Committee as confirmed by SEC is:",
        "options": [
          "Federal High Court",
          "Investment and Securities Tribunal",
          "Court of Appeal",
          "Appellate Body of the Securities and Exchange Commission"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp19_9",
        "prompt": "Investments and Securities Tribunal (IST) can be referred to as:",
        "options": [
          "A civil court",
          "A criminal court",
          "A quasi-judicial body",
          "A civil and criminal court"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp19_10",
        "prompt": "To appeal a decision of Securities and Exchange Commission before the IST, _____ pre-trial notice must be given to SEC:",
        "options": [
          "15 days",
          "1 month",
          "14 days",
          "7 days"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp19_11",
        "prompt": "The recognised mode of commencement of actions before the IST is:",
        "options": [
          "Originating summons",
          "Originating motion",
          "Petition",
          "Originating application"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp19_12",
        "prompt": "IST has jurisdiction over the following matters except dispute involving:",
        "options": [
          "The SEC and self regulatory organisation",
          "A capital market operator and SEC",
          "An investor and SEC",
          "CAC and SEC"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp19_13",
        "prompt": "The proceedings of the IST on any dispute must be completed within how many days of its commencement?",
        "options": [
          "180 days",
          "90 days",
          "60 days",
          "30 days"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp19_14",
        "prompt": "Jurisdiction over disputes involving a decision or determination of the Securities and Exchange Commission is vested in:",
        "options": [
          "Federal High Court exclusively",
          "State High Court and Federal High Court",
          "Investments and Securities Tribunal exclusively",
          "Investments and Securities Tribunal and Federal High Court"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp19_15",
        "scenario": "akinpawpaw",
        "prompt": "In the event of any dispute between Akinpawpaw (Nig.) Plc and other capital market operators, the adjudicatory body would be one of the following:",
        "options": [
          "The Federal High Court",
          "The Investments and Securities Tribunal",
          "State High Court",
          "High Court of the Federal Capital Territory"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp19_16",
        "scenario": "adago-smith",
        "prompt": "Assuming she has an unresolved dispute with her stockbroker over accounts of the transactions, she would under the Investments and Securities Act lay her complaints at:",
        "options": [
          "Nigerian Stock Exchange",
          "Investments and Securities Tribunal",
          "Securities and Exchange Commission",
          "Federal High Court"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp19_17",
        "scenario": "adago-smith",
        "prompt": "If a decision was reached in her favour but Kolade refuses to comply with the directive, where would she institute a fresh action against Kolade under the Investment and Securities Act?",
        "options": [
          "Federal High Court",
          "National Industrial Court",
          "Investments and Securities Tribunal",
          "Economic and Financial Crimes Commission"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp19_18",
        "scenario": "adago-smith",
        "prompt": "If she is dissatisfied with the decision after the action, in which Court would she file her Appeal?",
        "options": [
          "Federal High Court",
          "High Court of a State",
          "Court of Appeal",
          "Administrative Panel of the Securities and Exchange Commission"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp19_19",
        "scenario": "adago-smith",
        "prompt": "Assuming she obtained judgment against Kolade, in which Court should she enforce the judgment?",
        "options": [
          "Investments and Securities Tribunal",
          "Federal High Court",
          "State High Court",
          "National Industrial Court"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp19_20",
        "scenario": "adago-smith",
        "prompt": "If she is dissatisfied with the judgment of the Tribunal and wishes to appeal, the time limit within to appeal is:",
        "options": [
          "30 days after the decision",
          "1 month after the decision",
          "60 days after the decision",
          "2 months after the decision"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp19_21",
        "prompt": "None but one of the following is correct with regards to appeal against the Tribunal's decision in the exercise of its appellate jurisdiction:",
        "options": [
          "It can be on mixed point of law and fact",
          "It must be on point of law alone",
          "It must be on point of fact alone",
          "Consent of SEC must be obtained before it is filed"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp19_22",
        "prompt": "The following are correct about the Investments and Securities Tribunal except:",
        "options": [
          "The Tribunal may make rules regulating its procedures",
          "The Tribunal shall have the power to review its decision",
          "The proceedings of the Tribunal may be held in camera",
          "The Tribunal has both civil and criminal jurisdiction"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp19_23",
        "prompt": "The Investment and Securities Tribunal is composed of how many members?",
        "options": [
          "5",
          "15",
          "12",
          "10"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp19_24",
        "prompt": "The members of the Investment and Securities Tribunal are appointed by:",
        "options": [
          "The President of Nigeria",
          "The Minister of Finance",
          "The Chairman of the Tribunal",
          "Securities and Exchange Commission"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp19_25",
        "prompt": "Which of the following is true of the Chairman of the Investment and Securities Tribunal?",
        "options": [
          "He must be a legal practitioner with no less than 10 years post call experience",
          "He must be a legal practitioner with no less than 15 years post call experience and has cognate experience in capital market matters",
          "He must be a legal practitioner with no less than 12 years post call experience and has cognate experience in capital market matters",
          "He must be a legal practitioner with no less than 10 years post call experience and has cognate experience in capital market matters"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "id": "q_corp19_26",
        "prompt": "None of the following is not a resolution channel for investment disputes except:",
        "options": [
          "Alternative Dispute Resolution",
          "Administrative Proceedings Committee of the SEC",
          "Investment and Securities Tribunal",
          "None of the above"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp19_27",
        "prompt": "Companies Proceeding Rules does not apply to proceedings arising from the following except:",
        "options": [
          "Part A CAMA",
          "Part B CAMA",
          "Part C CAMA",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "id": "q_corp19_28",
        "prompt": "The Investment and Securities Tribunal is duly constituted if it consists of:",
        "options": [
          "5 members",
          "10 members",
          "3 members",
          "2 members"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "id": "q_corp19_29",
        "prompt": "Company proceedings may be commenced through the following modes except:",
        "options": [
          "Originating Summons",
          "Originating motion",
          "Petition",
          "Originating notice"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "id": "q_corp19_30",
        "scenario": "oluwaglass",
        "prompt": "Which court will have jurisdiction over the defamation suit?",
        "options": [
          "The Federal High Court",
          "The Investment and Securities Tribunal",
          "State High Court/High Court of the Federal Capital Territory",
          "Any of the above"
        ],
        "correct": 2,
        "explanation": ""
      }
    ]
  },
  {
    "courseId": 4,
    "topicName": "WK 20: Winding Up and Dissolution of Business/Non-Business Organisations",
    "scenarios": [
      {
        "key": "s_corp20_starplus",
        "text": "Mrs. Demidun, a shareholder in Starplus Plc having its registered office in Maitama, FCT, has filed a petition for winding up of the company on just and equitable ground. Answer the following questions:"
      },
      {
        "key": "s_corp20_goldpalms",
        "text": "The Board of Directors of Goldpalms Ltd has made a statutory declaration dated 1st July 2019 that they made a full inquiry into the affairs of the company and are of the opinion that the company will be able to pay its debt on or before 31st December, 2019."
      }
    ],
    "questions": [
      {
        "scenario": "s_corp20_starplus",
        "prompt": "The most appropriate court where the application above should be filed is:",
        "options": [
          "Any Federal High Court",
          "Federal High Court, Maitama",
          "High Court of the Federal Capital Territory",
          "Investment and Securities Tribunal"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_starplus",
        "prompt": "The effect of commencement of winding up proceedings on Starplus PLC is all but one of the following:",
        "options": [
          "No attachment of the company's properties is allowed",
          "No judgment debt can be claimed on the company",
          "No judgment sum can be claimed by the company",
          "Restriction on transfer of shares without court's permission"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_starplus",
        "prompt": "The type of winding up from the scenario is:",
        "options": [
          "Compulsory winding up",
          "Winding up by the Court",
          "Petitioner's winding up",
          "A and B"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_starplus",
        "prompt": "Apart from the ground stated by Mrs. Demidun in her petition, the other grounds for the type of winding up you identified above include all except:",
        "options": [
          "Special resolution by the company that it should be wound up compulsorily",
          "Failure to hold statutory meeting or deliver statutory report",
          "Failure to declare dividends for more than 5 years",
          "Number of members is below the legal minimum"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_starplus",
        "prompt": "In winding up of a company compulsorily by the Court, the company is deemed dissolved when:",
        "options": [
          "When the court makes a dissolution order on the company on the application of the liquidator",
          "When the court makes a winding up order",
          "When a liquidator is appointed",
          "Three months after registration by CAC of the accounts and returns of the final meeting of the company from the liquidator"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_starplus",
        "prompt": "None but one of the following can bring a petition for compulsory winding up of a company on ground of failure to hold statutory meeting:",
        "options": [
          "A shareholder of the company",
          "A director of the company",
          "A creditor of the company",
          "A debenture holder of the company"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_starplus",
        "prompt": "A company will be deemed unable to pay its debts in all but one of the following circumstances:",
        "options": [
          "Where a creditor to whom it is indebted in the sum of ₦2,000, by a notice in writing demanded for the debt to be paid and the company has for a period of three weeks thereafter neglected to pay",
          "Where a creditor to whom it is indebted in a sum exceeding ₦2,000, by a notice in writing demanded for the debt to be paid and the company has for a period of three weeks thereafter neglected to pay",
          "Where execution issued on the order of any court in favour of a creditor of the company is returned unsatisfied in whole or in part",
          "Where the court, taking into account any contingent or prospective liability of the company is satisfied that the company is unable to pay its debts"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_starplus",
        "prompt": "The following are not precluded from bringing petition for compulsory winding up of a company except:",
        "options": [
          "Corporate Affairs Commission",
          "The official receiver",
          "A creditor of the company",
          "A director of the company"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_starplus",
        "prompt": "Petition for winding up order by the Corporate Affairs Commission in cases arising from proceedings on inspector's report must be brought with the approval of:",
        "options": [
          "The President of Nigeria",
          "The Chief Judge of the Federation",
          "The Chief Law Officer of the Federation",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_starplus",
        "prompt": "A voluntary winding up commences:",
        "options": [
          "When petition is brought before the court",
          "At the time of passing of the resolution",
          "Where resolution is sanctioned by the Court",
          "Where notice of resolution is submitted to CAC"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_goldpalms",
        "prompt": "The above declaration is necessary where:",
        "options": [
          "It is proposed to wind up compulsorily",
          "As a condition precedent for conversion to a public company",
          "It is proposed to wind up voluntarily",
          "It is creditor's winding up"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_goldpalms",
        "prompt": "The above declaration made by the directors of the company is succeeded by:",
        "options": [
          "An ordinary resolution at a General Meeting for voluntary winding",
          "A special resolution at a General Meeting for voluntary winding up",
          "An extra ordinary resolution at an Extra-Ordinary meeting",
          "An extra ordinary resolution at an Annual General Meeting"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_goldpalms",
        "prompt": "Only one of the following persons is competent to be appointed as a liquidator of the company:",
        "options": [
          "Grant Corporate packaging Limited",
          "Chief Nuhu El-Rufai a director of the company",
          "Dapo Ribadu an undergraduate of University of Abuja born 1st January, 1994",
          "Chief John Okeke of John Okeke & Co External Solicitors to the Company"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_goldpalms",
        "prompt": "One of the following is incorrect. The company can only be dissolved after:",
        "options": [
          "Preparation of final Accounts by the Liquidator",
          "The General Meeting has received the Final Accounts",
          "The removal of the Liquidator",
          "Returns have been forwarded to the Commission"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_goldpalms",
        "prompt": "Assuming Goldpalms Ltd decides to wind up voluntarily, the declaration of solvency must be made ................ before the company's resolution?",
        "options": [
          "5 weeks",
          "3 weeks",
          "6 weeks",
          "4 weeks"
        ],
        "correct": 0,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_goldpalms",
        "prompt": "Which of the following is not a condition Goldpalms Ltd must fulfil to be able to wind up voluntarily?",
        "options": [
          "The company must be solvent",
          "The company's assets must exceed its liabilities",
          "The company should not be indebted at all",
          "None of the above"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_goldpalms",
        "prompt": "The liquidator appointed by the members may act in the case of creditors' voluntary winding up by a directive of:",
        "options": [
          "CAC",
          "The creditors",
          "The Court",
          "The members"
        ],
        "correct": 1,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_goldpalms",
        "prompt": "Every person liable to contribute to the assets of a Company in the event of winding up is called:",
        "options": [
          "A Creditor",
          "A Debenture holder",
          "A Defaulter",
          "A Contributory"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_goldpalms",
        "prompt": "In compulsory winding up, within how many days of making of the dissolution order must the liquidator submit a copy of the order to the Corporate Affairs Commission?",
        "options": [
          "15 days",
          "7 days",
          "21 days",
          "14 days"
        ],
        "correct": 3,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_goldpalms",
        "prompt": "The official receiver as defined in CAMA is:",
        "options": [
          "The receiver/manager appointed by the company",
          "The receiver/manager appointed by the creditors",
          "The Deputy Registrar of the FHC",
          "The Chief Registrar of the FHC"
        ],
        "correct": 2,
        "explanation": ""
      },
      {
        "scenario": "s_corp20_goldpalms",
        "prompt": "In a creditors' voluntary winding up, the company is deemed dissolved:",
        "options": [
          "After 3 months of the registration of the accounts by the liquidator and returns to CAC",
          "After the court has sanctioned the special resolution",
          "Immediately registration of the account is done and returns made to CAC",
          "None of the above"
        ],
        "correct": 0,
        "explanation": ""
      }
    ]
  }
];

/**
 * Seed a single topic's scenarios and questions.
 * Returns true if seeded, false if skipped (already seeded or topic not found).
 */
export function seedOneTopic(db, courseId, topicName, scenarios, questions) {
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
