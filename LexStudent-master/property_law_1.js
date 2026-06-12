export const propertyLawPart1 = [
  {
    courseId: 5,
    topicName: 'WK 3: General Overview and Applicable laws',
    scenarios: [],
    questions: [
      {
        prompt: 'The Property and Conveyancing Law is applicable in all but one of the following states:',
        options: ['Lagos State', 'Edo State', 'Delta State', 'Ekiti State'],
        correct: 0,
        explanation: 'The Property and Conveyancing Law (PCL) is applicable in the States belonging to the old Western Region: Ondo, Oyo, Osun, Ogun, Edo, Ekiti and Delta (OOOOEED). Lagos is not part of those States.',
      },
      {
        prompt: 'Tunde Adisa has agreed to sell his plot of land situate at No. 8, Akonduma street, Asaba to Mike Ontario for the sum of \u20a61,000,000. Which of the following laws will be inapplicable in the above transaction?',
        options: ['The Property and Conveyancing Law', 'The Conveyancing Act', 'The Stamp Duties Act', 'None of the above'],
        correct: 1,
        explanation: 'The property in question is situate in Asaba, Delta State, where the PCL and not the Conveyancing Act (CA) is applicable. The CA is applicable to States in the old Eastern and Northern region.',
      },
      {
        prompt: 'The transaction involving land which is usually but not necessarily for consideration is?',
        options: ['Sale', 'Mortgage', 'Assignment', 'Lease'],
        correct: 3,
        explanation: 'Lease is the transfer of possession in a property for a term of years certain, usually but not necessarily for consideration. Rent is not an essential requirement for the validity of a lease agreement.',
      },
      {
        prompt: 'One of the following is not true of the uses of a deed:',
        options: ['To effect conveyance of an interest, right or property in a real estate', 'Create an obligation binding on a person', 'Confirm some act whereby an interest or property has already passed', 'None of the above'],
        correct: 3,
      },
      {
        prompt: 'A deed is required in all but one of the following instances:',
        options: ['Gift of land', 'Voluntary surrender', 'Vesting declaration', 'Disclaimer'],
        correct: 3,
      },
      {
        prompt: 'All are essential elements for the validity of a deed except:',
        options: ['Signing', 'Sealing', 'Attestation', 'Delivery'],
        correct: 2,
      },
    ],
  },
  {
    courseId: 5,
    topicName: 'WK 4: Deeds and Power of Attorney',
    scenarios: [
      {
        key: 'igwe-chioma',
        text: 'Igwe Chioma is the landlady of the premises known as Kelly estate, Apo legislative district, Abuja. Mpokpowei Apollos has agreed with Igwe Chioma to rent the premises for a period of three years with an option to renew for another three years as agreed by them.',
      },
      {
        key: 'audu-gbedu',
        text: 'Audu Gbedu and Sarah Attah executed a deed of assignment whereby the former transferred his proprietary interest in a property situate at No. 4, Old Airport Road, Maitama, Abuja to the latter. The deed was executed on the 4th of December 2019 with the understanding that it will be binding when balance of purchase price is paid by the assignee, Sarah Attah. On the 25th of April, 2020, balance of purchase price was fully paid by the assignee.',
      },
      {
        key: 'mallam-buba',
        text: 'Mallam Buba Kawuche of No. 33 Cole Street, Wuse Abuja FCT is a civil servant in the Federal Ministry of External Affairs. He has just been posted to the Nigerian Embassy in London, UK. To ensure that his property is taken care of while he is away, he has decided to authorise Mrs Masuku Abamba of No. A1 Unguhu Street, Kubwa, Abuja to manage his property at No. 10, Macauly street, Bwari and No. 20, Ojuelegba, Wuse, Abuja for a consideration of \u20a650 million only. Part of the authority given to Mrs Masuku Abamba is the right to sell and convey the interests to any purchaser.',
      },
      {
        key: 'lekan-mufty',
        text: 'Lekan Mufty, a staff at the Nigerian Embassy in the State of Qatar, Doha has concluded arrangements to purchase a property at No. 46, Golf Club Road, Ibadan, Oyo State. The Vendor is Haija Ronke Jinadu, actress, of No. 82 Remidot Road, Ikorodu, Lagos. Mufty wants to use the property as his campaign headquarters for the Senatorial election. He has instructed Mr. Dozie Akinade to handle the negotiation, purchase and perfection of the title to the property on his behalf as a matter of urgency.',
      },
      {
        key: 'abejoye-family',
        text: 'The Abejoye family is a large family in Ajibogun town. The family owns many hectares of land. All the principal members of the family, 5 in number, conspired among themselves to make money from the lands, while still retaining the title in the land without the knowledge of the family head. They invited Afopina Esq to the meeting, who advised them to create a power of attorney in favour of the person they want to give the land to so he can use the land and they would get money from him. Afopina Esq then drafted the power of attorney which was executed by the oldest of the principal members of the family.',
      },
    ],
    questions: [
      // DEEDS – standalone
      {
        prompt: 'A deed is a mandatory requirement in all but one of the following transactions:',
        options: ['Lease of above three years', 'Donation of power', 'Gift of land', 'None of the above'],
        correct: 1,
      },
      {
        prompt: 'Pick out the odd one from the following:',
        options: ['Ezeigwe v Awudu', 'Ude v Uwara', 'Awojugbagbe Light Industries v Chinukwe', 'Powell v London Provincial Bank'],
        correct: 2,
      },
      {
        prompt: 'Only one of the following is not a feature of a power of attorney:',
        options: ['It is an instrument of delegation', 'It is a valid means of transfer of interest in land', 'It is a specie of a deed poll', 'It is generally revocable'],
        correct: 1,
      },
      {
        prompt: 'One of the following is not one of the effects of a receipt clause in a deed:',
        options: ['Makes the issuance of a separate receipt unnecessary', 'It constitutes good root of title to the transaction contained in the Deed', 'It is evidence of payment of consideration', 'It is authority to pay the sum to the vendor\'s solicitor where he presents such instrument'],
        correct: 1,
      },
      {
        prompt: 'One of the following is not true of a deed delivered in escrow:',
        options: ['The deed is binding from the date of execution', 'The innocent party is entitled to withdraw if the conditions are not fulfilled', 'The deed is not binding until condition is fulfilled', 'A and B above'],
        correct: 2,
      },
      {
        prompt: 'The order of perfection of a deed of assignment on a property located in Asaba, Delta is?',
        options: ['Registration, Consent and Stamping', 'Consent, Registration and Stamping', 'Registration, Stamping and Consent', 'Consent, Stamping and Registration'],
        correct: 3,
      },
      {
        prompt: 'For a property situate at No. 13, Onipanu, Bwari, Abuja the stamp duty payable on the deed of assignment for its sale shall be assessed as?',
        options: ['Fixed rate', 'Flat rate', 'Ad valorem', '40%'],
        correct: 2,
      },
      {
        prompt: 'A Purchaser of part of the property of a Vendor is not entitled to the entire title documents but can be protected by:',
        options: ['Covenant for Indemnity', 'Trust Declaration', 'Power of Attorney', 'Acknowledgment for custody and production'],
        correct: 3,
      },
      {
        prompt: 'The presence of which of these propositions between the commencement and date necessitates the use of recital in a deed?',
        options: ['Is', 'On', 'At', 'In'],
        correct: 0,
      },
      {
        prompt: 'A major distinction between Power of Attorney and a Contract of Sale of land is that the latter is valid on:',
        options: ['Execution', 'Delivery', 'Exchange', 'None of the above'],
        correct: 2,
      },
      {
        prompt: 'NOW THIS DEED WITNESSES AS FOLLOWS is the usual beginning of what part of a deed',
        options: ['Introductory part', 'Operative part', 'Miscellaneous', 'Testatum'],
        correct: 1,
      },
      {
        prompt: 'One of the following is not an example of a deed:',
        options: ['Deed of Tenancy', 'Deed of Release', 'Deed of Assignment', 'None of the above'],
        correct: 0,
      },
      {
        prompt: 'A deed is not required in all of the following transactions except:',
        options: ['Assents', 'Disclaimer', 'Voluntary surrender', 'Receipt'],
        correct: 2,
      },
      {
        prompt: 'One of the following transactions requires mandatory attestation to be valid:',
        options: ['Will', 'Deed of assignment', 'Deed of lease', 'Contract of sale of land'],
        correct: 0,
      },
      {
        prompt: 'The act of making clear copies of documents for all parties in a property transaction is termed:',
        options: ['Photocopying', 'Printing', 'Engrossment', 'Endorsement'],
        correct: 2,
      },
      {
        prompt: 'One of the following is not a reason why a deed of assignment should not be dated:',
        options: ['Because of the uncertainty of when governor\'s consent would be obtained', 'To avoid the incidence of late stamping', 'To avoid the incidence of late registration', 'To give the assignee ample time to investigate the assignor\'s title'],
        correct: 3,
      },
      {
        prompt: 'A deed is required to be stamped and registered within how many days of its execution?',
        options: ['20 and 40 days', '30 and 60 days', '20 and 30 days', '60 and 30 days'],
        correct: 1,
      },
      {
        prompt: 'When a vendor conveys property as a beneficial owner, one of the following is not implied:',
        options: ['That the lease is valid and subsisting', 'A right to convey', 'Quiet enjoyment of possession', 'Freedom from encumbrances except those disclosed'],
        correct: 0,
      },
      {
        prompt: 'A purchaser who wishes to pay the balance of the purchase money to the Vendor\'s solicitor may protect himself by inserting in the Deed of Assignment____',
        options: ['Indemnity clause', 'Receipt clause', 'Safe custody and acknowledgement for production Clause', 'Consideration clause'],
        correct: 1,
      },
      {
        prompt: 'Which of these is not a type of Deed?',
        options: ['Assignment', 'Indenture', 'Deed Poll', 'None of the above'],
        correct: 0,
      },
      {
        prompt: 'The clause that connects parties to the content and covenants in a deed is:',
        options: ['Testatum', 'Execution', 'Testimonium', 'Attestation'],
        correct: 2,
      },
      {
        prompt: 'THIS DEED OF ASSIGNMENT is the beginning of what part of a deed?',
        options: ['Commencement part', 'Testatum part', 'Operative part', 'Introductory part'],
        correct: 3,
      },
      {
        prompt: 'Mr. Bakare Akinola is a retired civil servant of the Ondo state government. His pension has not been paid. He wants to use one of his properties in Awolowo, Akure to raise money for his upkeep and that of his family. The options available to Mr. Bakare in this case are:',
        options: ['Sale, lease or mortgage', 'Gift intervivos, lease or charge', 'Mortgage, rent or charge', 'Lease, gift intervivos or charge'],
        correct: 0,
      },
      {
        prompt: 'The operative part of a deed ends with which of the following clauses?',
        options: ['Reddendum', 'Habendum', 'Parcel clause', 'Testimonium'],
        correct: 1,
      },

      // POWER OF ATTORNEY – standalone
      {
        prompt: 'A Power of Attorney granted to a person to "let premises to tenants and collect rent" is:',
        options: ['General Power of Attorney', 'Specific Power of Attorney', 'Revocable Power of Attorney', 'Irrevocable Power of Attorney'],
        correct: 1,
      },
      {
        prompt: 'The authority for the principle that in certain cases, especially on ground of equity, a power of Attorney can be used to transfer interest in land is:',
        options: ['Ibrahim v Obaje', 'National Bank of Nigeria v Korban Brothers', 'Benjamin v Kalio', 'Chime v Chime'],
        correct: 0,
      },
      {
        prompt: 'The power clause of a power of attorney is contained in what part of a deed?',
        options: ['Introductory part', 'Operative part', 'Miscellaneous part', 'Concluding part'],
        correct: 1,
      },
      {
        prompt: 'Where Mr Emma Okoro granted a Power of Attorney to Miss Ada Nwosu to manage his property situate in Lagos, but before Miss Nwosu could do so, he sold the property. The effect is that:',
        options: ['The sale is invalid', 'The power of attorney is deemed revoked expressly', 'The power of attorney is deemed revoked by operation of law', 'The power is deemed impliedly revoked'],
        correct: 3,
      },
      {
        prompt: 'The following are not incorrect about power of attorney except:',
        options: ['It does not transfer interest in land', 'It is an instrument of delegation', 'It has no special mode of creation in all instances', 'It should expressly state the power which the Donee can exercise'],
        correct: 2,
      },

      // DEEDS – scenario: igwe-chioma
      {
        scenario: 'igwe-chioma',
        prompt: 'All but one of the following is correct:',
        options: ['The transaction is not required to be by deed', 'The transaction is required to be by deed', 'The agreement is valid', 'Igwe Chioma can review Mpokpowei Apollos\' rent for another three years'],
        correct: 1,
        explanation: 'A lease for a term of three years renewable for another three years operates as a tenancy, and a tenancy agreement is not required to be by deed. Re Knight. Hand v Hall',
      },
      {
        scenario: 'igwe-chioma',
        prompt: 'The document to be executed by the parties in the above transaction is:',
        options: ['Tenancy agreement', 'Deed of lease', 'Deed of sublease', 'Deed of tenancy'],
        correct: 0,
      },

      // DEEDS – scenario: audu-gbedu
      {
        scenario: 'audu-gbedu',
        prompt: 'The effective date of delivery of the deed above is 4th December, 2019 based on the doctrine of:',
        options: ['Back date', 'Relating back', 'Transferred date', 'None of the above'],
        correct: 1,
      },
      {
        scenario: 'audu-gbedu',
        prompt: 'For the above transaction to be valid, the consent of _____ must be obtained:',
        options: ['Attorney General of the Federal Capital Territory', 'President of the Federal Republic of Nigeria', 'Attorney General of the Federation', 'Minister of the Federal Capital Territory'],
        correct: 3,
      },
      {
        scenario: 'audu-gbedu',
        prompt: 'The consent is to be sought by:',
        options: ['The Assignee', 'The Assignor', 'The Assignee\'s solicitor', 'Any of the above'],
        correct: 1,
      },
      {
        scenario: 'audu-gbedu',
        prompt: 'The Deed of assignment above is to be drafted by the:',
        options: ['Vendor\'s solicitor', 'Purchaser\'s solicitor', 'Assignor\'s solicitor', 'Assignee\'s solicitor'],
        correct: 3,
      },
      {
        scenario: 'audu-gbedu',
        prompt: 'Assuming you are the solicitor that drafted the document, the act of appending your name, address, stamp and seal on the document is known as?',
        options: ['Franking', 'Francline', 'Endorsement', 'Engrossment'],
        correct: 0,
      },

      // POWER OF ATTORNEY – scenario: lekan-mufty
      {
        scenario: 'lekan-mufty',
        prompt: 'The specifics of what Mr. Dozie can do will be contained in the ____ clause:',
        options: ['Testimonium clause', 'Testatum clause', 'Appointment clause', 'Power clause'],
        correct: 3,
      },
      {
        scenario: 'lekan-mufty',
        prompt: 'If Lekan Mufty was to execute the power of attorney in Doha, Qatar, it should be executed before a:',
        options: ['Legal practitioner', 'Commissioner for oaths', 'Magistrate or Justice of Peace', 'Notary public'],
        correct: 3,
      },
      {
        scenario: 'lekan-mufty',
        prompt: 'To validly revoke the power of attorney, Lekan Mufty can do so:',
        options: ['Orally', 'In writing', 'By Deed', 'All of the above'],
        correct: 2,
      },
      {
        scenario: 'lekan-mufty',
        prompt: 'Assuming in the appointment clause of the power of attorney by Lekan Mufty, it is written that "I appoint the law firm of Dozie Akinade & Co. to be my lawful attorney in my name and on my behalf...", none but one of the following is correct about the appointment:',
        options: ['It is a valid appointment because the law firm is registered', 'It is a valid appointment because the law firm has a recognised principal partner', 'It is an invalid appointment because the law firm does not have juristic personality', 'It is a valid appointment as it was made by deed'],
        correct: 2,
      },

      // POWER OF ATTORNEY – scenario: mallam-buba
      {
        scenario: 'mallam-buba',
        prompt: 'The following except one are circumstances warranting the need for a power of attorney:',
        options: ['Where the expertise of the donee is required', 'Where the donor is unavailable', 'Where a mortgage is created by sub-demise under the Conveyancing Act', 'Where a mortgage is created by sub-demise under the PCL'],
        correct: 3,
      },
      {
        scenario: 'mallam-buba',
        prompt: 'One of the following is not contained in the document to be executed by the parties:',
        options: ['Testimonium', 'Habendum', 'Execution', 'Commencement'],
        correct: 1,
      },
      {
        scenario: 'mallam-buba',
        prompt: 'Since the power of attorney by Mallam Buba Kawuche was given for valuable consideration, it is most suitable as a/an?',
        options: ['Revocable power of attorney', 'Irredeemable power of attorney', 'Irrevocable power of attorney', 'B and C above'],
        correct: 2,
      },
      {
        scenario: 'mallam-buba',
        prompt: 'Assuming before Mrs. Masuku Abamba could sell the land to a purchaser, the donor, Mallam Buba Kawuche sold the land himself to a third party, the power given to the donee is said to have been revoked:',
        options: ['Expressly', 'Impliedly', 'By operation of the law', 'All of the above'],
        correct: 1,
      },
      {
        scenario: 'mallam-buba',
        prompt: 'By the provisions of Section 8(1), CA, which of the following is correct?',
        options: ['Mallam Buba Kawuche can revoke the Power of Attorney but must do so expressly', 'Mallam Buba Kawuche cannot revoke the power of Attorney except with the concurrence of the Donee', 'Only in the event of the death of Mallam Buba Kawuche can the power of Attorney be revoked without the concurrence of the Donee', 'The payment of consideration has no effect on the power of a Donor of a Power of Attorney to revoke it'],
        correct: 1,
      },
      {
        scenario: 'mallam-buba',
        prompt: 'If Mrs. Masuku Abamba had not paid the \u20a650 million but it was part of the terms of the Power of Attorney that it would be irrevocable for two years, then:',
        options: ['Mallam Buba Kawuche can only revoke the Power of Attorney expressly', 'Even in the event of death of Mallam Buba Kawuche, the power of Attorney cannot be revoked without the Donee\'s concurrence', 'Mallam Buba Kawuche can revoke the power of Attorney without the concurrence of the Donee', 'A Power of Attorney not given for valuable consideration can only be expressed to be irrevocable for a period not exceeding one year'],
        correct: 3,
      },

      // POWER OF ATTORNEY – scenario: abejoye-family
      {
        scenario: 'abejoye-family',
        prompt: 'All but one of the following is incorrect of the power of Attorney executed in the above scenario:',
        options: ['It is valid as all the principal members consented', 'It is voidable at the instance of the members of the family', 'It is void as it was not executed by the family head', 'It is voidable at the instance of the family head'],
        correct: 2,
      },
      {
        scenario: 'abejoye-family',
        prompt: 'Assuming the power of Attorney was executed by the family head alone without the knowledge of the principal members of the family, then:',
        options: ['It is voidable at the instance of the principal members of the family', 'It is voidable at the instance of the members of the family', 'It is valid', 'It is void ab initio'],
        correct: 0,
      },
      {
        scenario: 'abejoye-family',
        prompt: 'In the above scenario, Afopina Esq has breached which Rule of RPC?',
        options: ['Rule 15', 'Rule 24', 'Rule 1', 'A and C'],
        correct: 3,
      },
    ],
  },
];
