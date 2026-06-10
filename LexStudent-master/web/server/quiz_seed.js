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
