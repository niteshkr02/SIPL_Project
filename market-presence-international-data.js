    (function () {
      // 1. INTERNATIONAL DESTINATIONS DATA
      const worldCountriesData = [
        {
          id: "tw", name: "Taiwan", code: "TW", left: "83.8%", top: "36.1%",
          hubType: "East Asia Distribution Hub", partner: "Formosa Pacific Steel Partners",
          officer: "Chen Wei-Ming (Trade Representative)", phone: "+886 2 2700 8899", email: "taiwan.trade@shakambharigroup.com",
          address: "Taipei World Trade Center, Taipei"
        },
        {
          id: "tr", name: "Turkey", code: "TR", left: "58.1%", top: "27.2%",
          hubType: "Eurasian Steel Logistics", partner: "Bosphorus Iron & Alloy Importers",
          officer: "Hakan Yilmaz", phone: "+90 212 380 4400", email: "turkey.export@shakambharigroup.com",
          address: "Levent Business Center, Istanbul"
        },
        {
          id: "it", name: "Italy", code: "IT", left: "52.6%", top: "24.7%",
          hubType: "Southern European Hub", partner: "Lombardia Steel Europe S.r.l.",
          officer: "Marco Rossi", phone: "+39 02 8901 2345", email: "europe.sales@shakambharigroup.com",
          address: "Via Montenapoleone, Milan"
        },
        {
          id: "eg", name: "Egypt", code: "EG", left: "58.7%", top: "33.3%",
          hubType: "North African Logistics Partner", partner: "Nile Infra Metals Co.",
          officer: "Tariq El-Sayed", phone: "+20 2 2735 6789", email: "egypt.trade@shakambharigroup.com",
          address: "New Cairo Business District, Cairo"
        },
        {
          id: "jp", name: "Japan", code: "JP", left: "88.8%", top: "30.2%",
          hubType: "Far East Trade Hub", partner: "Nippon Shakambhari Metals Hub",
          officer: "Kenji Takahashi", phone: "+81 3 5540 1122", email: "japan.sales@shakambharigroup.com",
          address: "Chiyoda-ku Industrial Hub, Tokyo"
        },
        {
          id: "kr", name: "South Korea", code: "KR", left: "85.3%", top: "29.1%",
          hubType: "East Asian Infra Partner", partner: "Han River Structural Steel",
          officer: "Min-Soo Park", phone: "+82 2 3456 7890", email: "korea.trade@shakambharigroup.com",
          address: "Gangnam Trade Tower, Seoul"
        },
        {
          id: "sa", name: "Saudi Arabia", code: "SA", left: "63.0%", top: "36.3%",
          hubType: "Middle East Mega-Projects Hub", partner: "GCC Heavy Infra Supplies",
          officer: "Faisal Al-Mansoor", phone: "+966 11 460 3344", email: "ksa.sales@shakambharigroup.com",
          address: "King Fahd Road, Riyadh"
        },
        {
          id: "ae", name: "UAE", code: "AE", left: "65.4%", top: "36.0%",
          hubType: "Gulf Regional Export Center", partner: "Gulf Commercial Steel Logistics",
          officer: "Rashid Al-Maktoum", phone: "+971 4 321 9876", email: "uae.trade@shakambharigroup.com",
          address: "Jebel Ali Free Zone, Dubai"
        },
        {
          id: "np", name: "Nepal", code: "NP", left: "73.7%", top: "34.6%",
          hubType: "SAARC Regional Partner", partner: "Himalayan Infra Steel Suppliers",
          officer: "Ramesh Adhikari", phone: "+977 1 422 5566", email: "nepal.sales@shakambharigroup.com",
          address: "Lazimpat, Kathmandu"
        },
        {
          id: "bd", name: "Bangladesh", code: "BD", left: "75.1%", top: "36.8%",
          hubType: "Neighboring Exports Hub", partner: "Bengal Delta Metals & Infra",
          officer: "Rafiqul Islam", phone: "+880 2 988 4433", email: "bd.trade@shakambharigroup.com",
          address: "Gulshan Commercial Area, Dhaka"
        },
        {
          id: "vn", name: "Vietnam", code: "VN", left: "79.6%", top: "44.0%",
          hubType: "ASEAN Trade Hub", partner: "ASEAN Structural Steel Corp.",
          officer: "Nguyen Van Hung", phone: "+84 24 3934 5678", email: "vietnam.sales@shakambharigroup.com",
          address: "Ho Chi Minh Port Complex"
        },
        {
          id: "de", name: "Germany", code: "DE", left: "52.4%", top: "22.2%",
          hubType: "Central European Hub", partner: "Rheinland Heavy Metals GmbH",
          officer: "Stefan Müller", phone: "+49 69 9754 0000", email: "germany.sales@shakambharigroup.com",
          address: "Frankfurt Industrial Park"
        },
        {
          id: "gb", name: "United Kingdom", code: "GB", left: "50.0%", top: "21.4%",
          hubType: "UK & European Logistics", partner: "Albion Metals Trading UK Ltd",
          officer: "David Sterling", phone: "+44 20 7946 0912", email: "uk.sales@shakambharigroup.com",
          address: "Canary Wharf, London"
        },
        {
          id: "us", name: "United States", code: "US", left: "23.5%", top: "33.5%",
          hubType: "North American Trade Station", partner: "Trans-Atlantic Steel Alliance",
          officer: "Robert Vance", phone: "+1 212 555 0199", email: "usa.sales@shakambharigroup.com",
          address: "Houston Steel Terminal, Texas"
        },
        {
          id: "sg", name: "Singapore", code: "SG", left: "78.8%", top: "49.3%",
          hubType: "Maritime Trade Center", partner: "Lion City Metals & Shipping Hub",
          officer: "Marcus Tan", phone: "+65 6789 0123", email: "sg.trade@shakambharigroup.com",
          address: "Marina Bay Trade Center, Singapore"
        },
        {
          id: "ke", name: "Kenya", code: "KE", left: "60.2%", top: "50.7%",
          hubType: "East African Logistics Station", partner: "East Africa Infrastructure Steel",
          officer: "Joseph Ochieng", phone: "+254 20 271 8899", email: "africa.sales@shakambharigroup.com",
          address: "Industrial Area, Nairobi"
        },
        {
          id: "za", name: "South Africa", code: "ZA", left: "57.8%", top: "64.6%",
          hubType: "Southern African Hub", partner: "Southern Cross Metals (Pty) Ltd",
          officer: "Johan van der Merwe", phone: "+27 11 800 1234", email: "sa.sales@shakambharigroup.com",
          address: "Sandton City, Johannesburg"
        },
        {
          id: "au", name: "Australia", code: "AU", left: "92.0%", top: "68.8%",
          hubType: "Oceanic Distribution Depot", partner: "Oceanic Steel & Resources",
          officer: "Liam O'Connor", phone: "+61 2 9250 8800", email: "aus.sales@shakambharigroup.com",
          address: "Sydney Olympic Park Hub"
        },
        {
          id: "lk", name: "Sri Lanka", code: "LK", left: "72.2%", top: "46.2%",
          hubType: "Indian Ocean Hub", partner: "Island Infrastructure Links",
          officer: "Dilshan Perera", phone: "+94 11 230 4567", email: "sl.sales@shakambharigroup.com",
          address: "Colombo Port Terminal"
        },
        {
          id: "in_hq", name: "India HQ", code: "IN", left: "74.5%", top: "37.5%", isHQ: true,
          hubType: "Global Manufacturing & Corporate HQ", partner: "Shakambhari Corporate HQ",
          officer: "Rajesh Sharma (Global Export Sales)", phone: "+91 98300 12345", email: "export.sales@shakambharigroup.com",
          address: "10, Princep Street, Kolkata, India"
        }
      ];

      // 2. DOMESTIC PERSONNEL DATA (zones ⇄ districts/clusters)
      // Real active manpower directory — mirrors manpower_directory.json at
      // the repo root (kept in sync by hand; see generate_directory.py to
      // regenerate both from the master Excel sheet). Embedded inline
      // rather than fetched: this is a static site with no build step, and
      // fetch() of a local JSON file fails under file://.
      const indiaZonesData = [
        {
          "key": "north-india",
          "zoneState": "North India",
          "totalCount": 23,
          "stateHead": {
            "slNo": 1,
            "empName": "VISHWAMBHAR JAIMAN",
            "designation": "GM",
            "cluster": "Haryana, Punjab, Rajasthan, Uttrakhand, Himachal, J&K.",
            "districts": "ALL, haryana & rajasthan (retail) & punjab (project)",
            "phoneOfficial": "7605057738",
            "phonePersonal": "",
            "primaryEmail": "vbhjaiman@gmail.com",
            "groupEmail": "marketing.jaipur@shakambharigroup.in"
          },
          "districtPersonnel": [
            {
              "slNo": 1,
              "empName": "VISHWAMBHAR JAIMAN",
              "designation": "GM",
              "cluster": "Haryana, Punjab, Rajasthan, Uttrakhand, Himachal, J&K.",
              "districts": "ALL, haryana & rajasthan (retail) & punjab (project)",
              "phoneOfficial": "7605057738",
              "phonePersonal": "",
              "primaryEmail": "vbhjaiman@gmail.com",
              "groupEmail": "marketing.jaipur@shakambharigroup.in"
            },
            {
              "slNo": 2,
              "empName": "AJAY KUMAR",
              "designation": "Senior Marketing Executive",
              "cluster": "Haryana",
              "districts": "Jhajjhar, Sonipat",
              "phoneOfficial": "7596014912",
              "phonePersonal": "9621701648",
              "primaryEmail": "ajvj00007@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 3,
              "empName": "RAVI KUMAR",
              "designation": "ASO",
              "cluster": "Haryana",
              "districts": "Sirsa",
              "phoneOfficial": "9147413396",
              "phonePersonal": "9050133006",
              "primaryEmail": "ravisidhmukhiya1593@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 4,
              "empName": "KHAGENDAR YADAV",
              "designation": "Senior Technical Executive",
              "cluster": "Haryana",
              "districts": "Karnal, Pundri & Sonepat",
              "phoneOfficial": "9147763619",
              "phonePersonal": "7206604516",
              "primaryEmail": "khagender11009@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 5,
              "empName": "SACHIN VERMA",
              "designation": "ASO",
              "cluster": "Haryana",
              "districts": "Rohtak",
              "phoneOfficial": "9748995559",
              "phonePersonal": "9996439264",
              "primaryEmail": "kundanpura55@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 6,
              "empName": "NIRAJ (NEW JOINER)",
              "designation": "ASO",
              "cluster": "Haryana",
              "districts": "Hasi & Jind",
              "phoneOfficial": "8053383862",
              "phonePersonal": "",
              "primaryEmail": "vermaneeraj0013@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 7,
              "empName": "MOHIT GILL",
              "designation": "Senior Manager",
              "cluster": "Haryana",
              "districts": "Haryana",
              "phoneOfficial": "9038414747",
              "phonePersonal": "7015279997",
              "primaryEmail": "",
              "groupEmail": "elegant.haryana@shakambharigroup.in"
            },
            {
              "slNo": 8,
              "empName": "SOHAN LAL",
              "designation": "ASM",
              "cluster": "Haryana",
              "districts": "AMBALA & YAMUNA NAGAR",
              "phoneOfficial": "9147767625",
              "phonePersonal": "7206719492",
              "primaryEmail": "sohan.gyasiya@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 9,
              "empName": "ANIL DOGRA",
              "designation": "ASM",
              "cluster": "Punjab",
              "districts": "Patiala, Ludhiana, Jalandhar, Amritsar, Tarn Taran Sahib, Chandigarh, Mohali, Panchkula, Ropar (Rupnagar), Shahid Bhagat Singh Nagar (nawanshahr)",
              "phoneOfficial": "9147104665",
              "phonePersonal": "9888755595",
              "primaryEmail": "anildogra.chd@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 10,
              "empName": "ANIL KATARIA",
              "designation": "Technical Executive",
              "cluster": "Punjab",
              "districts": "Mohali, Chandigarh, Panchkula",
              "phoneOfficial": "8981220768",
              "phonePersonal": "8968883665",
              "primaryEmail": "lalitkumardimpy44@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 11,
              "empName": "RAJESH SINGHLA",
              "designation": "ASM",
              "cluster": "Punjab",
              "districts": "Bhatinda, Fazilka, Muktsar, Faridkot, Mansa & Ferozepur.",
              "phoneOfficial": "9147104666",
              "phonePersonal": "9814421115",
              "primaryEmail": "rajeshsingla0106@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 12,
              "empName": "LALIT KUMAR CHOUDHURY",
              "designation": "ASO",
              "cluster": "Punjab",
              "districts": "Bhatinda & Muktsar",
              "phoneOfficial": "8981228649",
              "phonePersonal": "9872583808",
              "primaryEmail": "lalitkumardimpy44@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 13,
              "empName": "MUKESH SONI",
              "designation": "ASM",
              "cluster": "Punjab",
              "districts": "Patiala, Sangrur, Barnala (South Punjab) new district Malerkotla.",
              "phoneOfficial": "",
              "phonePersonal": "9781800208",
              "primaryEmail": "mukeshsonimicky@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 14,
              "empName": "SURESH KUMAR MAHALA",
              "designation": "ASO",
              "cluster": "Rajasthan",
              "districts": "SIKAR, NAWALGARH",
              "phoneOfficial": "9748929991",
              "phonePersonal": "8696800057",
              "primaryEmail": "kps1997suresh@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 15,
              "empName": "LALIT SHARMA",
              "designation": "Technical Executive",
              "cluster": "Rajasthan",
              "districts": "BHARATPUR",
              "phoneOfficial": "9007549944",
              "phonePersonal": "8619379633",
              "primaryEmail": "lalitsharma3039@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 16,
              "empName": "DINESH CHAND JAIMAN",
              "designation": "ASO",
              "cluster": "Rajasthan",
              "districts": "DAUSA",
              "phoneOfficial": "9007303633",
              "phonePersonal": "8890661856",
              "primaryEmail": "dinesh8890661856@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 17,
              "empName": "VIKASH KUMAR CHOUDHURY",
              "designation": "ASO",
              "cluster": "Rajasthan",
              "districts": "JHUNJHUNU",
              "phoneOfficial": "9038417441",
              "phonePersonal": "9610076210",
              "primaryEmail": "vk076210@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 18,
              "empName": "SHASHANK SHARMA",
              "designation": "ASO",
              "cluster": "Rajasthan",
              "districts": "HANUMANGARH",
              "phoneOfficial": "9007967596",
              "phonePersonal": "9001550500",
              "primaryEmail": "vinusharma50@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 19,
              "empName": "VIJENDRA SAINI",
              "designation": "Manager",
              "cluster": "Rajasthan",
              "districts": "JHUNJHUNU, CHURU, SIKAR, BIKANER, GANGANAGAR, HANUMAN GARH",
              "phoneOfficial": "9831648447",
              "phonePersonal": "9414272021",
              "primaryEmail": "viju0721@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 20,
              "empName": "VIKAS SARASWAT",
              "designation": "Manager",
              "cluster": "Rajasthan",
              "districts": "JAIPUR",
              "phoneOfficial": "9007968296",
              "phonePersonal": "8003698711",
              "primaryEmail": "vikassaraswat123@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 21,
              "empName": "MANU JAIMAN",
              "designation": "Senior Marketing Executive",
              "cluster": "Rajasthan",
              "districts": "ALWAR, DAUSA, DHOLPUR, BHARATPUR, KARAULI, TONK, SAWAI MADHOPUR.",
              "phoneOfficial": "9007959578",
              "phonePersonal": "9928172922",
              "primaryEmail": "manu.jaiman7@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 22,
              "empName": "SANJAY SINGH",
              "designation": "SO",
              "cluster": "UTTARAKHAND",
              "districts": "DEHRADUN",
              "phoneOfficial": "",
              "phonePersonal": "9639535352",
              "primaryEmail": "sanjugariya72@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 51,
              "empName": "VIKRAM SINGH",
              "designation": "ASO",
              "cluster": "Rajasthan",
              "districts": "ALWAR",
              "phoneOfficial": "9038416868",
              "phonePersonal": "7597576016",
              "primaryEmail": "vikramsingh7576@gmail.com",
              "groupEmail": ""
            }
          ]
        },
        {
          "key": "jharkhand",
          "zoneState": "Jharkhand",
          "totalCount": 9,
          "stateHead": {
            "slNo": 23,
            "empName": "MANOJ SHARMA",
            "designation": "Senior GM",
            "cluster": "JHARKHAND, MP & UP",
            "districts": "JHARKHAND, MP & UP",
            "phoneOfficial": "9748322412",
            "phonePersonal": "",
            "primaryEmail": "manoj.sharma@shakambharigroup.in",
            "groupEmail": ""
          },
          "districtPersonnel": [
            {
              "slNo": 23,
              "empName": "MANOJ SHARMA",
              "designation": "Senior GM",
              "cluster": "JHARKHAND, MP & UP",
              "districts": "JHARKHAND, MP & UP",
              "phoneOfficial": "9748322412",
              "phonePersonal": "",
              "primaryEmail": "manoj.sharma@shakambharigroup.in",
              "groupEmail": ""
            },
            {
              "slNo": 24,
              "empName": "RAVI KUMAR YADAV (DSO)",
              "designation": "Distributor Sales Officer",
              "cluster": "Jharkhand",
              "districts": "Koderma",
              "phoneOfficial": "9748989998",
              "phonePersonal": "8340156934",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 25,
              "empName": "RAJNI KANT JHA",
              "designation": "Sales Manager",
              "cluster": "Jharkhand",
              "districts": "Khunti, Simdega, Lohardaga, Gumla, Latehar, Ramgarh & Ranchi.",
              "phoneOfficial": "9097283759",
              "phonePersonal": "7250239611",
              "primaryEmail": "rajnikant.jha@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 26,
              "empName": "PARITOSH DANGI",
              "designation": "Senior Marketing Executive",
              "cluster": "Jharkhand",
              "districts": "Hazaribagh, Chatra, Koderma & Giridih",
              "phoneOfficial": "9534982177",
              "phonePersonal": "7004313360",
              "primaryEmail": "paritosh.dangi@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 27,
              "empName": "JANAK YADAV",
              "designation": "Senior Marketing Executive",
              "cluster": "Jharkhand",
              "districts": "Gumla & Lohardaga",
              "phoneOfficial": "9147747859",
              "phonePersonal": "9110190117",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 28,
              "empName": "MANOJ KUMAR",
              "designation": "Senior Marketing Executive",
              "cluster": "Jharkhand",
              "districts": "Koderma, Chatra & Hazaribagh",
              "phoneOfficial": "9147747870",
              "phonePersonal": "9507914066",
              "primaryEmail": "manojsinghhaz@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 29,
              "empName": "SANTOSH KUMAR",
              "designation": "Senior Marketing Executive",
              "cluster": "Jharkhand",
              "districts": "Hazaribagh",
              "phoneOfficial": "9147747872",
              "phonePersonal": "9934149866",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 30,
              "empName": "Binod Bedi",
              "designation": "Senior Marketing Executive",
              "cluster": "Jharkhand",
              "districts": "RANCHI",
              "phoneOfficial": "9147747874",
              "phonePersonal": "7004245785",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 31,
              "empName": "Roshan Kumar Singh",
              "designation": "Senior Marketing Executive",
              "cluster": "Jharkhand",
              "districts": "CHATRA",
              "phoneOfficial": "9147747875",
              "phonePersonal": "8210356166",
              "primaryEmail": "rajraushann999@gmail.com",
              "groupEmail": ""
            }
          ]
        },
        {
          "key": "madhya-pradesh",
          "zoneState": "Madhya Pradesh",
          "totalCount": 2,
          "stateHead": {
            "slNo": 32,
            "empName": "DEEPAK UPADHYAY",
            "designation": "ASM",
            "cluster": "Madhya Pradesh",
            "districts": "Madhya Pradesh",
            "phoneOfficial": "9147380807",
            "phonePersonal": "9755502693",
            "primaryEmail": "du350011@live.com",
            "groupEmail": ""
          },
          "districtPersonnel": [
            {
              "slNo": 32,
              "empName": "DEEPAK UPADHYAY",
              "designation": "ASM",
              "cluster": "Madhya Pradesh",
              "districts": "Madhya Pradesh",
              "phoneOfficial": "9147380807",
              "phonePersonal": "9755502693",
              "primaryEmail": "du350011@live.com",
              "groupEmail": ""
            },
            {
              "slNo": 33,
              "empName": "Arun Jatav",
              "designation": "Senior Marketing Executive",
              "cluster": "Madhya Pradesh",
              "districts": "Shivpuri, Sheopur, Rajgarh, Vidisha, Morena, Bhind, Gwalior, Ashoknagar.",
              "phoneOfficial": "9147422959",
              "phonePersonal": "9179836367",
              "primaryEmail": "arun.jatav2008@gmail.com",
              "groupEmail": ""
            }
          ]
        },
        {
          "key": "north-east",
          "zoneState": "North East",
          "totalCount": 17,
          "stateHead": {
            "slNo": 34,
            "empName": "DEBASHIS DUTTA",
            "designation": "DGM",
            "cluster": "North East",
            "districts": "North East",
            "phoneOfficial": "7605042475",
            "phonePersonal": "",
            "primaryEmail": "4mdebashis@gmail.com",
            "groupEmail": ""
          },
          "districtPersonnel": [
            {
              "slNo": 34,
              "empName": "DEBASHIS DUTTA",
              "designation": "DGM",
              "cluster": "North East",
              "districts": "North East",
              "phoneOfficial": "7605042475",
              "phonePersonal": "",
              "primaryEmail": "4mdebashis@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 35,
              "empName": "RANJEET KR SINGH",
              "designation": "GM",
              "cluster": "North East",
              "districts": "ASSAM",
              "phoneOfficial": "9147999502",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 36,
              "empName": "PRADIP KR. DEB",
              "designation": "Senior Marketing Executive",
              "cluster": "BarakValley (BKV)",
              "districts": "Karimganj, Hailakandi, Cachar",
              "phoneOfficial": "9147157105",
              "phonePersonal": "9435073012",
              "primaryEmail": "lock0112@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 37,
              "empName": "SURAJ MUNDA",
              "designation": "Distributor Sales Officer",
              "cluster": "BarakValley (BKV)",
              "districts": "Cachar",
              "phoneOfficial": "9163478800",
              "phonePersonal": "7002572202",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 38,
              "empName": "DEBASHISH ACHARJEE",
              "designation": "ASO",
              "cluster": "BarakValley (BKV)",
              "districts": "Hailakandi",
              "phoneOfficial": "7596036736",
              "phonePersonal": "9401377855",
              "primaryEmail": "bittuvirus@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 39,
              "empName": "DIGANTA DEKA",
              "designation": "ASM",
              "cluster": "Lower Assam",
              "districts": "BARPETA, KOKRAJHAR, KAMRUP, NALBARI",
              "phoneOfficial": "9147164285",
              "phonePersonal": "9864276189",
              "primaryEmail": "diganta2u1989@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 40,
              "empName": "NAZRUL ISLAM",
              "designation": "ASO",
              "cluster": "Lower Assam",
              "districts": "BARPETA & NALBARI",
              "phoneOfficial": "8420048233",
              "phonePersonal": "7002636402",
              "primaryEmail": "n.islam0550@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 41,
              "empName": "KANAK DEY",
              "designation": "ASM",
              "cluster": "Central Assam",
              "districts": "MORIGAON, HOJAI, NAGAON, LUMDING, DIMA, HASAO, ANGLONG",
              "phoneOfficial": "7596014919",
              "phonePersonal": "9854378120",
              "primaryEmail": "kanakdey0052@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 42,
              "empName": "PAWAN CHAWDHURY",
              "designation": "ASO",
              "cluster": "Lower Assam",
              "districts": "KOKRAJHAR",
              "phoneOfficial": "9147163566",
              "phonePersonal": "8638641977",
              "primaryEmail": "munna121choudhary@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 43,
              "empName": "SAMARJEET SINHA",
              "designation": "ASM",
              "cluster": "Tripura",
              "districts": "KHOWAI, DHALAI",
              "phoneOfficial": "",
              "phonePersonal": "9774390089",
              "primaryEmail": "samarjitsinha01@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 44,
              "empName": "RAKESH DEBNATH",
              "designation": "SO",
              "cluster": "Tripura",
              "districts": "Dharmanagar, Dhalai & North Tripura",
              "phoneOfficial": "",
              "phonePersonal": "8794828113",
              "primaryEmail": "rakeshmaplst1234@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 45,
              "empName": "SUJAN BANIK",
              "designation": "ASM",
              "cluster": "Tripura",
              "districts": "Agartala, West Tripura, North Tripura",
              "phoneOfficial": "",
              "phonePersonal": "9436489392",
              "primaryEmail": "sams.banik@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 46,
              "empName": "SINTU SAIKIA",
              "designation": "ASM",
              "cluster": "Kamrup",
              "districts": "KAMRUP",
              "phoneOfficial": "",
              "phonePersonal": "8011295982",
              "primaryEmail": "sintusaikia999@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 47,
              "empName": "SAAN SAIKIA",
              "designation": "ASM",
              "cluster": "Upper Assam",
              "districts": "JORHAT",
              "phoneOfficial": "",
              "phonePersonal": "8638148090",
              "primaryEmail": "saan0908@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 48,
              "empName": "DILIP Shah",
              "designation": "ASM",
              "cluster": "Upper Assam",
              "districts": "NB - Sonitpur, North Lakhimpur, Upper Assam",
              "phoneOfficial": "",
              "phonePersonal": "9864239864",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 49,
              "empName": "Golam Rahman",
              "designation": "SO",
              "cluster": "Kamrup",
              "districts": "KAMRUP",
              "phoneOfficial": "",
              "phonePersonal": "7002167732",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 50,
              "empName": "TARUN HAZARIKA",
              "designation": "ASM",
              "cluster": "Meghalaya",
              "districts": "Meghalaya",
              "phoneOfficial": "",
              "phonePersonal": "8638139588",
              "primaryEmail": "",
              "groupEmail": ""
            }
          ]
        },
        {
          "key": "uttar-pradesh",
          "zoneState": "Uttar Pradesh",
          "totalCount": 6,
          "stateHead": {
            "slNo": 52,
            "empName": "SUJIT BAJPAI",
            "designation": "SH",
            "cluster": "Uttar Pradesh",
            "districts": "UP",
            "phoneOfficial": "",
            "phonePersonal": "9838382222",
            "primaryEmail": "",
            "groupEmail": ""
          },
          "districtPersonnel": [
            {
              "slNo": 52,
              "empName": "SUJIT BAJPAI",
              "designation": "SH",
              "cluster": "Uttar Pradesh",
              "districts": "UP",
              "phoneOfficial": "",
              "phonePersonal": "9838382222",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 53,
              "empName": "SIDDHARTH PANDEY",
              "designation": "",
              "cluster": "Uttar Pradesh",
              "districts": "Deoria, Kushinagar",
              "phoneOfficial": "",
              "phonePersonal": "9415886915",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 54,
              "empName": "ARUN KUMAR",
              "designation": "Deputy Manager",
              "cluster": "Uttar Pradesh",
              "districts": "Gorakhpur, Basti, Sant Kabir Nagar, Maharajganj, Siddharth Nagar.",
              "phoneOfficial": "9748969998",
              "phonePersonal": "8887752175",
              "primaryEmail": "ararun755@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 55,
              "empName": "VARUN TIWARI",
              "designation": "Senior Marketing Executive",
              "cluster": "Uttar Pradesh",
              "districts": "Kanpur, Unnao, Fatehpur, Etawah, Auraiya & Orai.",
              "phoneOfficial": "9748130708",
              "phonePersonal": "7007421370",
              "primaryEmail": "varun.tivari@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 56,
              "empName": "AVINESH JAISWAL",
              "designation": "Senior Manager",
              "cluster": "Uttar Pradesh",
              "districts": "Azamgarh, Ballia, Mau, Ghazipur, Varanasi, Jaunpur, Mirzapur, Ambedkar Nagar, chandauli, sonbhadra, sultanpur.",
              "phoneOfficial": "9147026877",
              "phonePersonal": "8004928373",
              "primaryEmail": "rajjournalist01@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 57,
              "empName": "SHIVJEET MISHRA",
              "designation": "Senior ASM",
              "cluster": "Uttar Pradesh",
              "districts": "PRAYAGRAJ, PRATAPGARH, Banda, chitrakoot, Kaushambi.",
              "phoneOfficial": "",
              "phonePersonal": "9140411332",
              "primaryEmail": "shivjitmishra@gmail.com",
              "groupEmail": ""
            }
          ]
        },
        {
          "key": "odisha",
          "zoneState": "Odisha",
          "totalCount": 7,
          "stateHead": {
            "slNo": 58,
            "empName": "Pradyut Chakraborty",
            "designation": "DGM",
            "cluster": "Odisha",
            "districts": "Odisha",
            "phoneOfficial": "7606002213",
            "phonePersonal": "",
            "primaryEmail": "pradyut0310@gmail.com",
            "groupEmail": ""
          },
          "districtPersonnel": [
            {
              "slNo": 58,
              "empName": "Pradyut Chakraborty",
              "designation": "DGM",
              "cluster": "Odisha",
              "districts": "Odisha",
              "phoneOfficial": "7606002213",
              "phonePersonal": "",
              "primaryEmail": "pradyut0310@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 59,
              "empName": "Sheikh Noor Ifteqar",
              "designation": "ASM",
              "cluster": "Odisha",
              "districts": "Jagatsinghpur, Cuttack, Nayagarh, Khordah & Puri.",
              "phoneOfficial": "",
              "phonePersonal": "9438014855",
              "primaryEmail": "Iftekhar4855@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 60,
              "empName": "Pratap Singh",
              "designation": "ASO",
              "cluster": "Odisha",
              "districts": "Jajpur",
              "phoneOfficial": "",
              "phonePersonal": "8280208226",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 61,
              "empName": "Shekhar Nayak",
              "designation": "ASM",
              "cluster": "Odisha",
              "districts": "Jajpur, Bhadrak, Kendrapara, Keonjar, Mayurbhanj & Balasore.",
              "phoneOfficial": "",
              "phonePersonal": "9090623635",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 62,
              "empName": "Amit Das",
              "designation": "",
              "cluster": "Odisha",
              "districts": "Balasore",
              "phoneOfficial": "",
              "phonePersonal": "7008133503",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 63,
              "empName": "Swaroop Ranjan Patnayak",
              "designation": "",
              "cluster": "Odisha",
              "districts": "Berhampore",
              "phoneOfficial": "",
              "phonePersonal": "8249826362",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 64,
              "empName": "Pankaj Panda",
              "designation": "",
              "cluster": "Odisha",
              "districts": "Angul",
              "phoneOfficial": "",
              "phonePersonal": "8917228941",
              "primaryEmail": "",
              "groupEmail": ""
            }
          ]
        },
        {
          "key": "bihar",
          "zoneState": "Bihar",
          "totalCount": 30,
          "stateHead": {
            "slNo": 66,
            "empName": "PRIYESH PRIYAM",
            "designation": "AGM",
            "cluster": "Bihar",
            "districts": "BIHAR",
            "phoneOfficial": "9931318677",
            "phonePersonal": "",
            "primaryEmail": "priyeshpriyam@gmail.com",
            "groupEmail": ""
          },
          "districtPersonnel": [
            {
              "slNo": 65,
              "empName": "DHIRAJ KUMAR SINHA",
              "designation": "ACCOUNTANT",
              "cluster": "Bihar",
              "districts": "BIHAR",
              "phoneOfficial": "8083422361",
              "phonePersonal": "",
              "primaryEmail": "dhirajkumar427@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 66,
              "empName": "PRIYESH PRIYAM",
              "designation": "AGM",
              "cluster": "Bihar",
              "districts": "BIHAR",
              "phoneOfficial": "9931318677",
              "phonePersonal": "",
              "primaryEmail": "priyeshpriyam@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 67,
              "empName": "AMANJEET KUMAR SUNNY",
              "designation": "ASM",
              "cluster": "Bihar",
              "districts": "VAISHALI & SAMASTIPUR",
              "phoneOfficial": "9147106704",
              "phonePersonal": "9199341071",
              "primaryEmail": "amanjeet.sunny@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 68,
              "empName": "DEEPAK SINHA",
              "designation": "ASM",
              "cluster": "Bihar",
              "districts": "GAYA GT ROAD",
              "phoneOfficial": "9147106688",
              "phonePersonal": "9572793135",
              "primaryEmail": "sinhaji.gaya@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 69,
              "empName": "KUNAL KAUSHIK",
              "designation": "ASM",
              "cluster": "Bihar",
              "districts": "PATNA, BEGUSARIA, ARA & KHAGARIA",
              "phoneOfficial": "9147106700",
              "phonePersonal": "9386737525",
              "primaryEmail": "kunalkaushik007@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 70,
              "empName": "ASHISH KUMAR",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "PATNA",
              "phoneOfficial": "9147106701",
              "phonePersonal": "9304381831",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 71,
              "empName": "SANTOSH KUMAR",
              "designation": "DRIVER",
              "cluster": "Bihar",
              "districts": "BIHAR",
              "phoneOfficial": "9006440644",
              "phonePersonal": "",
              "primaryEmail": "santoshkumarneha2@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 72,
              "empName": "SREE RAM KAUSHIK",
              "designation": "GM",
              "cluster": "Bihar",
              "districts": "BIHAR",
              "phoneOfficial": "6207086601",
              "phonePersonal": "",
              "primaryEmail": "shreeramkaushik06@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 73,
              "empName": "NIRBHAY KUMAR SINGH",
              "designation": "MANAGER & CO-ORDINATOR (BRANDING & LOGISTICS)",
              "cluster": "Bihar",
              "districts": "BIHAR",
              "phoneOfficial": "9708888829",
              "phonePersonal": "",
              "primaryEmail": "nirbhay4patna@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 74,
              "empName": "RAHUL TIWARI",
              "designation": "Manager",
              "cluster": "Bihar",
              "districts": "ROHTAS, SASARAM",
              "phoneOfficial": "9525520730",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 75,
              "empName": "RAJNISH KUMAR",
              "designation": "Manager",
              "cluster": "Bihar",
              "districts": "MUZAFFARPUR, SITAMARHI",
              "phoneOfficial": "9147106692",
              "phonePersonal": "9113110292",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 76,
              "empName": "RITESH KUMAR RITURAJ",
              "designation": "OFFICE BOY",
              "cluster": "Bihar",
              "districts": "BIHAR",
              "phoneOfficial": "7677181373",
              "phonePersonal": "",
              "primaryEmail": "riteshgorgama@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 77,
              "empName": "CHANDAN KUMAR KARN",
              "designation": "PROJECT MANAGER (MARKETING)",
              "cluster": "Bihar",
              "districts": "BIHAR",
              "phoneOfficial": "9147106687",
              "phonePersonal": "9835069796",
              "primaryEmail": "ckkarn2009@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 78,
              "empName": "RAKESH KUMAR SINHA",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "ROHTAS, KAIMUR & AURANGABAD",
              "phoneOfficial": "9147106694",
              "phonePersonal": "7903513292",
              "primaryEmail": "rakesh.sinha132@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 79,
              "empName": "RAVI KUMAR",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "GAYA",
              "phoneOfficial": "9147106689",
              "phonePersonal": "9334336040",
              "primaryEmail": "ravinayan2k9@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 80,
              "empName": "PRAMOD KUMAR",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "VAISHALI",
              "phoneOfficial": "9147106690",
              "phonePersonal": "7979848143",
              "primaryEmail": "pramod.sri2014@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 81,
              "empName": "SUNIL SINGH",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "ROHTAS, KAIMUR",
              "phoneOfficial": "8409948622",
              "phonePersonal": "",
              "primaryEmail": "sunilsinghg001@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 82,
              "empName": "SINTU KUMAR",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "GAYA",
              "phoneOfficial": "9147106702",
              "phonePersonal": "9570535316",
              "primaryEmail": "sintusintugudiya@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 83,
              "empName": "BHASKAR KUMAR",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "BEGHUSARAI",
              "phoneOfficial": "9508610910",
              "phonePersonal": "",
              "primaryEmail": "singhbhaskar961@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 84,
              "empName": "GAUTAM KHAN (Vicky Singh)",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "JEHANABAD",
              "phoneOfficial": "9147163570",
              "phonePersonal": "7004443904",
              "primaryEmail": "gautamkhan786@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 85,
              "empName": "SUBODH KUMAR",
              "designation": "Technical Executive",
              "cluster": "Bihar",
              "districts": "MUZAFFARPUR",
              "phoneOfficial": "7258889285",
              "phonePersonal": "",
              "primaryEmail": "subodhkum456sin@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 86,
              "empName": "RAJESH RANJAN",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "DARBHANGA",
              "phoneOfficial": "8051870207",
              "phonePersonal": "",
              "primaryEmail": "rrjha1992@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 87,
              "empName": "BHANU KUMAR THAKUR",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "SAHARSA & MADHEPURA",
              "phoneOfficial": "6204830189",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 88,
              "empName": "SHARAT KIRAN",
              "designation": "Senior Manager",
              "cluster": "Bihar",
              "districts": "MOTIHARI (E/W-CHAMAPARAN), MADHUBANI, DARBHANGA, MUZAFFARPUR, SITAMARHI, SHEOHAR.",
              "phoneOfficial": "9147106703",
              "phonePersonal": "9955511011",
              "primaryEmail": "sharatkiran9@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 89,
              "empName": "SARVESH KUMAR",
              "designation": "Senior Marketing Executive",
              "cluster": "Bihar",
              "districts": "LAKHISARAI, JAMUI, SOME PART OF PATNA EAST (BARH TO LAKHISARAI).",
              "phoneOfficial": "9038949476",
              "phonePersonal": "9006093400",
              "primaryEmail": "sarveshkumarpaharpur@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 90,
              "empName": "DILIP KUMAR",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "SAHARSA, MADHEPURA & SUPAUL",
              "phoneOfficial": "9147106699",
              "phonePersonal": "9122822839",
              "primaryEmail": "dilipkumar73391@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 91,
              "empName": "DHIRAJ BHARDWAJ",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "BEGHUSARAI, KHAGARIA",
              "phoneOfficial": "7044103139",
              "phonePersonal": "7277259021",
              "primaryEmail": "dhrj.bharadwaj@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 92,
              "empName": "GUNJAN KUMAR SHARMA",
              "designation": "Senior Marketing Executive",
              "cluster": "Bihar",
              "districts": "NALANDA, NAWADA",
              "phoneOfficial": "9147106697",
              "phonePersonal": "8789823671",
              "primaryEmail": "gunjan98760@gmail.com",
              "groupEmail": ""
            },
            {
              "slNo": 93,
              "empName": "VIKASH KUMAR SINGH",
              "designation": "ASO",
              "cluster": "Bihar",
              "districts": "SITAMARHI, SHEOHAR",
              "phoneOfficial": "7488743845",
              "phonePersonal": "",
              "primaryEmail": "vikashsolanki983@yahoo.in",
              "groupEmail": ""
            },
            {
              "slNo": 94,
              "empName": "ASFAQUE AHAMAD",
              "designation": "Technical Executive",
              "cluster": "Bihar",
              "districts": "SAHARSA",
              "phoneOfficial": "9147106698",
              "phonePersonal": "7903264639",
              "primaryEmail": "asfaque05mit@gmail.com",
              "groupEmail": ""
            }
          ]
        },
        {
          "key": "north-bengal",
          "zoneState": "North Bengal",
          "totalCount": 20,
          "stateHead": {
            "slNo": 113,
            "empName": "RANJAN SAHU",
            "designation": "AGM",
            "cluster": "North Bengal",
            "districts": "APD-COB-DARJ-JALP",
            "phoneOfficial": "9337240385",
            "phonePersonal": "",
            "primaryEmail": "",
            "groupEmail": ""
          },
          "districtPersonnel": [
            {
              "slNo": 95,
              "empName": "Vikram Narsaria",
              "designation": "",
              "cluster": "North Bengal",
              "districts": "SILIGURI",
              "phoneOfficial": "",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 96,
              "empName": "BINOY JHA",
              "designation": "Marketing Executive",
              "cluster": "North Bengal",
              "districts": "ALIPURDUAR",
              "phoneOfficial": "8918486044",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 97,
              "empName": "ANIRUDHYA DEY",
              "designation": "Marketing Executive",
              "cluster": "North Bengal",
              "districts": "ALIPURDUAR",
              "phoneOfficial": "7605083445",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 98,
              "empName": "CHANCHAL DEY",
              "designation": "Technical Executive",
              "cluster": "North Bengal",
              "districts": "ALIPURDUAR",
              "phoneOfficial": "8420161646",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 99,
              "empName": "RAKESH SARKAR",
              "designation": "Deputy Manager",
              "cluster": "North Bengal",
              "districts": "ALIPURDUAR & COOCHBEHAR",
              "phoneOfficial": "8420161687",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 100,
              "empName": "RATUL ROY",
              "designation": "Marketing Executive",
              "cluster": "North Bengal",
              "districts": "COOCHBEHAR",
              "phoneOfficial": "9147106683",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 101,
              "empName": "KARTIK DEY",
              "designation": "Senior Marketing Executive",
              "cluster": "North Bengal",
              "districts": "COOCHBEHAR",
              "phoneOfficial": "9147114714",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 102,
              "empName": "SURESH SHIL",
              "designation": "Technical Executive",
              "cluster": "North Bengal",
              "districts": "COOCHBEHAR",
              "phoneOfficial": "9147157110",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 103,
              "empName": "SUVANKAR DHAR",
              "designation": "Marketing Executive",
              "cluster": "North Bengal",
              "districts": "COOCHBEHAR",
              "phoneOfficial": "9831648291",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 104,
              "empName": "SUBARNA SARKHEL",
              "designation": "Technical Executive",
              "cluster": "North Bengal",
              "districts": "COOCHBEHAR",
              "phoneOfficial": "9147114712",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 105,
              "empName": "ANIMESH KARMAKAR",
              "designation": "Distributor Sales Officer",
              "cluster": "North Bengal",
              "districts": "COOCHBEHAR",
              "phoneOfficial": "6293149698",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 106,
              "empName": "DIPANKAR PAUL",
              "designation": "Marketing Executive",
              "cluster": "North Bengal",
              "districts": "DARJEELING",
              "phoneOfficial": "9163512277",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 107,
              "empName": "SANJEEB BARMAN",
              "designation": "Marketing Executive",
              "cluster": "North Bengal",
              "districts": "DARJEELING",
              "phoneOfficial": "9147106676",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 108,
              "empName": "CHIRNJEET CHAKRABORTY",
              "designation": "Marketing Executive",
              "cluster": "North Bengal",
              "districts": "DARJEELING",
              "phoneOfficial": "7605085436",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 109,
              "empName": "BIMAN SANYAL",
              "designation": "Marketing Executive",
              "cluster": "North Bengal",
              "districts": "JALPAIGURI",
              "phoneOfficial": "8695612047",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 110,
              "empName": "AVIJIT DAS",
              "designation": "Marketing Executive",
              "cluster": "North Bengal",
              "districts": "JALPAIGURI",
              "phoneOfficial": "9163263311",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 111,
              "empName": "SUBHJIT ROY",
              "designation": "Distributor Sales Officer",
              "cluster": "North Bengal",
              "districts": "JALPAIGURI",
              "phoneOfficial": "6293149697",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 112,
              "empName": "AGNIVA DUTTA",
              "designation": "Technical Manager",
              "cluster": "North Bengal",
              "districts": "APD-COB-DARJ-JALP",
              "phoneOfficial": "7596036703",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 113,
              "empName": "RANJAN SAHU",
              "designation": "AGM",
              "cluster": "North Bengal",
              "districts": "APD-COB-DARJ-JALP",
              "phoneOfficial": "9337240385",
              "phonePersonal": "",
              "primaryEmail": "",
              "groupEmail": ""
            },
            {
              "slNo": 114,
              "empName": "AKASH AGARWAL",
              "designation": "",
              "cluster": "North Bengal",
              "districts": "",
              "phoneOfficial": "6293149735",
              "phonePersonal": "8100660990",
              "primaryEmail": "",
              "groupEmail": "operation.roi@shakambharigroup.in",
              "isStateHead": true
            }
          ]
        }
      ];

      // Some personnel zones in the source PDF bundle several states under one
      // regional head (North India covers 6 states, North East covers 3);
      // showing them as one shared bubble/card meant every state in that
      // zone lit up together and stacked identical popovers on screen. So
      // the site view is state-based instead: every covered state gets its
      // own independent card, bubble and popover, built here by splitting
      // each zone's roster to the actual state each person's cluster/
      // district text belongs to (a regional GM/DGM with no single
      // assigned state — e.g. slNo 1 covers all of North India — appears
      // under every state in their zone, since they're the only contact
      // for the ones with no dedicated local rep, like Himachal Pradesh
      // and J&K here).
      const REGION_MEMBER_STATE_MAP = {
        1: ['haryana', 'punjab', 'rajasthan', 'uttarakhand', 'himachal-pradesh', 'jammu-and-kashmir'],
        2: ['haryana'], 3: ['haryana'], 4: ['haryana'], 5: ['haryana'], 6: ['haryana'], 7: ['haryana'], 8: ['haryana'],
        9: ['punjab'], 10: ['punjab'], 11: ['punjab'], 12: ['punjab'], 13: ['punjab'],
        14: ['rajasthan'], 15: ['rajasthan'], 16: ['rajasthan'], 17: ['rajasthan'], 18: ['rajasthan'],
        19: ['rajasthan'], 20: ['rajasthan'], 21: ['rajasthan'], 51: ['rajasthan'],
        22: ['uttarakhand'],
        34: ['assam', 'tripura', 'meghalaya'],
        35: ['assam'], 36: ['assam'], 37: ['assam'], 38: ['assam'], 39: ['assam'], 40: ['assam'],
        41: ['assam'], 42: ['assam'], 46: ['assam'], 47: ['assam'], 48: ['assam'], 49: ['assam'],
        43: ['tripura'], 44: ['tripura'], 45: ['tripura'],
        50: ['meghalaya']
      };

      // every zone not listed above maps entirely onto one state (North
      // Bengal's coverage is only part of West Bengal on the map, hence the
      // 'west-bengal' slug)
      const ZONE_SINGLE_STATE = {
        'jharkhand': 'jharkhand',
        'madhya-pradesh': 'madhya-pradesh',
        'uttar-pradesh': 'uttar-pradesh',
        'odisha': 'odisha',
        'bihar': 'bihar',
        'north-bengal': 'west-bengal'
      };

      function isHeadDesignation(desig) {
        const d = (desig || '').toUpperCase();
        return ['GM', 'DGM', 'SH', 'AGM', 'SENIOR MANAGER'].some((k) => d.includes(k));
      }

      // bubble coordinates reused from the original (pre-refactor) fake
      // per-state data; Uttarakhand never had its own entry there, so its
      // position is estimated from the map's own geography
      const COVERED_STATE_MARKERS = [
        { slug: 'rajasthan', code: 'RJ', name: 'Rajasthan', left: '27.6%', top: '34.8%' },
        { slug: 'haryana', code: 'HR', name: 'Haryana', left: '31.6%', top: '30.1%' },
        { slug: 'punjab', code: 'PB', name: 'Punjab', left: '27.8%', top: '22.7%' },
        { slug: 'uttarakhand', code: 'UK', name: 'Uttarakhand', left: '37.5%', top: '27.5%' },
        { slug: 'himachal-pradesh', code: 'HP', name: 'Himachal Pradesh', left: '30.8%', top: '22.6%' },
        { slug: 'jammu-and-kashmir', code: 'JK', name: 'Jammu & Kashmir', left: '24.6%', top: '17.2%' },
        { slug: 'uttar-pradesh', code: 'UP', name: 'Uttar Pradesh', left: '44.2%', top: '35.0%' },
        { slug: 'madhya-pradesh', code: 'MP', name: 'Madhya Pradesh', left: '27.8%', top: '47.6%' },
        { slug: 'bihar', code: 'BR', name: 'Bihar', left: '57.7%', top: '38.8%' },
        { slug: 'jharkhand', code: 'JH', name: 'Jharkhand', left: '58.3%', top: '45.7%' },
        { slug: 'west-bengal', code: 'WB', name: 'West Bengal', left: '68.1%', top: '48.0%' },
        { slug: 'odisha', code: 'OD', name: 'Odisha', left: '59.9%', top: '54.9%' },
        { slug: 'assam', code: 'AS', name: 'Assam', left: '78.9%', top: '37.2%' },
        { slug: 'tripura', code: 'TR', name: 'Tripura', left: '77.5%', top: '44.2%' },
        { slug: 'meghalaya', code: 'ML', name: 'Meghalaya', left: '79.5%', top: '38.9%' }
      ];

      // ── District names for the district picker, derived from the
      // existing personnel "districts" free-text field — no new data, just
      // cleaned-up parsing of what's already there. That field is messy
      // source-spreadsheet text: abbreviations ("APD-COB-DARJ-JALP"),
      // parenthetical notes ("Ropar (Rupnagar)"), and — for the multi-state
      // zone heads — whole-state/whole-region descriptions ("ALL, haryana &
      // rajasthan...") instead of real districts. This is a best-effort
      // clean: strip notes, split on common separators, drop anything that
      // isn't a plausible district name (a known state name, a short
      // ALL-CAPS code, or a generic word like "ALL"/"retail"). A few source
      // rows use non-standard spellings for the same place (e.g.
      // "Sonepat"/"Sonipat") and surface as two separate entries since
      // there's no reliable way to know they're the same place from the
      // text alone.
      const DISTRICT_TOKEN_BLOCKLIST = new Set(['all', 'retail', 'project', 'north east', 'ne', 'mp', 'up', 'wb', 'hr', 'pb', 'rj', 'jh', 'or', 'od', 'as', 'tr', 'ml', 'hp', 'jk', 'uk', 'ua', 'br', 'ncr']);
      const STATE_NAMES_LOWER = new Set(COVERED_STATE_MARKERS.map((m) => m.name.toLowerCase()));

      function toDistrictTitleCase(s) {
        return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
      }

      function parseDistrictTokens(str) {
        if (!str) return [];
        const cleaned = str.replace(/\([^)]*\)/g, ''); // strip parenthetical notes first, before splitting
        return cleaned
          .split(/[,&/;]| and | new district /gi)
          .map((t) => t.replace(/^\s*n\.?b\.?\s*-\s*/i, ''))
          .map((t) => t.replace(/\./g, '').trim())
          .filter(Boolean)
          .filter((t) => !DISTRICT_TOKEN_BLOCKLIST.has(t.toLowerCase()))
          .filter((t) => !/^[A-Z]{2,6}(-[A-Z]{2,6}){1,}$/.test(t))
          .filter((t) => !STATE_NAMES_LOWER.has(t.toLowerCase()))
          .filter((t) => t.split(/\s+/).length <= 4)
          .map(toDistrictTitleCase);
      }

      function buildStateDistricts(personnel) {
        const map = new Map();
        personnel.forEach((p) => {
          parseDistrictTokens(p.districts).forEach((d) => {
            const key = d.toLowerCase().replace(/\s+/g, '');
            if (!map.has(key)) map.set(key, d);
          });
        });
        return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
      }

      function buildIndiaStatesFlat() {
        const personnelBySlug = {};
        COVERED_STATE_MARKERS.forEach((m) => { personnelBySlug[m.slug] = []; });

        indiaZonesData.forEach((zone) => {
          zone.districtPersonnel.forEach((person) => {
            const slugs = REGION_MEMBER_STATE_MAP[person.slNo] || (ZONE_SINGLE_STATE[zone.key] ? [ZONE_SINGLE_STATE[zone.key]] : []);
            slugs.forEach((slug) => { if (personnelBySlug[slug]) personnelBySlug[slug].push(person); });
          });
        });

        return COVERED_STATE_MARKERS
          .map((m) => {
            const personnel = personnelBySlug[m.slug] || [];
            // an explicit isStateHead flag on a person overrides the
            // designation-keyword guess below — used when the featured
            // contact for a state isn't the one holding the "senior-most"
            // title (e.g. a hand-off to a new state head)
            const head = personnel.find((p) => p.isStateHead) || personnel.find((p) => isHeadDesignation(p.designation)) || personnel[0] || null;
            const districts = buildStateDistricts(personnel);
            return { slug: m.slug, code: m.code, name: m.name, left: m.left, top: m.top, stateHead: head, districtPersonnel: personnel, districts };
          })
          .filter((s) => s.districtPersonnel.length > 0);
      }

      const indiaStatesFlat = buildIndiaStatesFlat();
      function findState(slug) { return indiaStatesFlat.find((s) => s.slug === slug) || null; }

      // blank/"-" contact fields should simply not render a dead tel:/mailto:
      // button, rather than link to nothing
      function telHref(num) { return num && num.trim() ? `tel:${num.replace(/\s+/g, '')}` : null; }
      function mailHref(addr) { return addr && addr.trim() ? `mailto:${addr.trim()}` : null; }

      function personActionsHtml(person, primaryLabel, secondaryLabel) {
        const callHref = telHref(person.phoneOfficial) || telHref(person.phonePersonal);
        const mailHrefVal = mailHref(person.groupEmail) || mailHref(person.primaryEmail);
        const btns = [];
        if (callHref) btns.push(`<a href="${callHref}" class="mpp-btn mpp-btn-primary"><span class="mpp-btn-icon" aria-hidden="true">📞</span> ${primaryLabel}</a>`);
        if (mailHrefVal) btns.push(`<a href="${mailHrefVal}" class="mpp-btn mpp-btn-secondary"><span class="mpp-btn-icon" aria-hidden="true">✉️</span> ${secondaryLabel}</a>`);
        return btns.length ? `<div class="mpp-actions">${btns.join('')}</div>` : '';
      }

      // ── LEFT: state head card, updates whenever a state is selected ──
      // Contact details (phone/email) are no longer shown as boxed text —
      // they're wired invisibly into the Call/Email buttons instead. The
      // old phone/email area is now a single clickable location card that
      // opens the district popup below.
      const stateHeadCard = document.getElementById('stateHeadCard');

      function renderStateHeadCard(state) {
        if (!stateHeadCard) return;
        if (!state || !state.stateHead) {
          stateHeadCard.classList.add('is-empty');
          stateHeadCard.innerHTML = `<p class="mpp-empty-hint">Click a covered state on the map to view its State Head.</p>`;
          return;
        }
        stateHeadCard.classList.remove('is-empty');
        const head = state.stateHead;
        const hasDistricts = !!(state.districts && state.districts.length);
        // just the first district alphabetically — the location card is a
        // display label, not a per-state "current selection" (the popup it
        // opens is read-only, see renderDistrictPopupGrid below)
        const locationText = hasDistricts ? `${state.districts[0]} District, ${state.name}` : state.name;
        stateHeadCard.innerHTML = `
          <div class="shc-row">
            <span class="shc-avatar" aria-hidden="true">⭐</span>
            <div class="shc-id">
              <div class="shc-name">${head.empName}</div>
              <div class="shc-role">${head.designation || 'State Head'}</div>
            </div>
          </div>
          <button type="button" class="shc-location-card"${hasDistricts ? '' : ' disabled'}>
            <span class="shc-location-icon" aria-hidden="true">📍</span>
            <span class="shc-location-text">${locationText}</span>
            ${hasDistricts ? '<span class="shc-location-chevron" aria-hidden="true">›</span>' : ''}
          </button>
          ${personActionsHtml(head, 'Call', 'Email')}
        `;
        if (hasDistricts) {
          const locBtn = stateHeadCard.querySelector('.shc-location-card');
          if (locBtn) locBtn.addEventListener('click', () => openDistrictPopup(state.slug));
        }
      }

      // ── DISTRICT POPUP: floating overlay listing every district for the
      // currently open state, opened from the location card above. Read-
      // only display — the district names inside are not clickable, there's
      // no "select a district" interaction, just the full list. ──
      const districtPopupOverlay = document.getElementById('districtPopupOverlay');
      const districtPopupTitle = document.getElementById('districtPopupTitle');
      const districtPopupGrid = document.getElementById('districtPopupGrid');
      const districtPopupClose = document.getElementById('districtPopupClose');
      let districtPopupLastFocus = null;

      function renderDistrictPopupGrid(state) {
        if (!districtPopupGrid) return;
        districtPopupGrid.innerHTML = state.districts.map((d) => `
          <div class="district-pop-card">
            <span class="district-pop-icon" aria-hidden="true">📍</span>
            <span class="district-pop-name">${d}</span>
          </div>
        `).join('');
      }

      function openDistrictPopup(stateSlug) {
        const state = findState(stateSlug);
        if (!state || !state.districts || !state.districts.length || !districtPopupOverlay) return;
        if (districtPopupTitle) districtPopupTitle.textContent = `Districts in ${state.name}`;
        renderDistrictPopupGrid(state);
        districtPopupLastFocus = document.activeElement;
        districtPopupOverlay.classList.add('open');
        districtPopupOverlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('district-popup-locked');
        if (districtPopupClose) districtPopupClose.focus();
      }

      function closeDistrictPopup() {
        if (!districtPopupOverlay || !districtPopupOverlay.classList.contains('open')) return;
        districtPopupOverlay.classList.remove('open');
        districtPopupOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('district-popup-locked');
        if (districtPopupLastFocus && districtPopupLastFocus.focus) districtPopupLastFocus.focus();
      }

      if (districtPopupClose) districtPopupClose.addEventListener('click', closeDistrictPopup);
      if (districtPopupOverlay) {
        districtPopupOverlay.addEventListener('click', (e) => {
          if (e.target === districtPopupOverlay) closeDistrictPopup();
        });
      }
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && districtPopupOverlay && districtPopupOverlay.classList.contains('open')) closeDistrictPopup();
      });

      // ── RIGHT PANEL: state head card + a plain list of every covered
      // state below it (click a name to jump straight there) — no more
      // "all states" grid screen and no back/forward history, since the
      // list makes every state reachable in one click already ──
      const indiaDrillPanel = document.getElementById('indiaDrillPanel');
      const idpTitle = document.getElementById('idpTitle');
      const idpSubtitle = document.getElementById('idpSubtitle');
      const idpStateList = document.getElementById('idpStateList');

      // Default landing state: West Bengal (HQ) state-head details, instead
      // of an empty "hover a marker" hint, so the panel never loads blank.
      let currentStateSlug = 'west-bengal';

      function renderStateList() {
        if (!idpStateList) return;
        const sorted = indiaStatesFlat.slice().sort((a, b) => a.name.localeCompare(b.name));
        idpStateList.innerHTML = `
          <div class="idp-state-list-title">All Covered States</div>
          <div class="idp-state-list-items">
            ${sorted.map((s) => `<button type="button" class="idp-state-item" data-state="${s.slug}">${s.name}</button>`).join('')}
          </div>
        `;
        idpStateList.querySelectorAll('.idp-state-item').forEach((btn) => {
          btn.addEventListener('click', () => { selectState(btn.dataset.state); syncIndiaPinActiveState(btn.dataset.state); });
        });
        syncStateListActive(currentStateSlug);
      }

      function syncStateListActive(stateSlug) {
        if (!idpStateList) return;
        idpStateList.querySelectorAll('.idp-state-item').forEach((btn) => {
          btn.classList.toggle('active', btn.dataset.state === stateSlug);
        });
      }

      function renderStatePanel(stateSlug) {
        const state = findState(stateSlug);
        if (idpTitle) idpTitle.innerHTML = `<span aria-hidden="true">📍</span> ${state ? state.name : 'Select a State'}`;
        if (idpSubtitle) idpSubtitle.textContent = state && state.stateHead ? 'State Head' : '';
        renderStateHeadCard(state);
        setStateHighlight(stateSlug);
        syncStateListActive(stateSlug);
      }

      function selectState(stateSlug) {
        if (!stateSlug || stateSlug === currentStateSlug) return;
        currentStateSlug = stateSlug;
        closeDistrictPopup();
        renderStatePanel(stateSlug);
      }

      function setStateHighlight(stateSlug) {
        if (!statesGroupEl) return;
        statesGroupEl.classList.toggle('has-active', !!stateSlug);
        stateShapeEls.forEach((s) => {
          s.classList.toggle('state-active', !!stateSlug && s.dataset.state === stateSlug);
        });
      }

      function syncIndiaPinActiveState(stateSlug) {
        if (!indiaPinsLayer) return;
        indiaPinsLayer.querySelectorAll('.map-pin').forEach((p) => {
          p.classList.toggle('active', !!stateSlug && p.dataset.slug === stateSlug);
        });
      }

      // hover = temporary preview, reverts to whichever state is actually
      // locked in (currentStateSlug) on mouse-leave — same hover-vs-lock
      // split the World tab already uses
      function previewIdpState(stateSlug) {
        renderStatePanel(stateSlug);
      }

      function clearIdpPreview() {
        renderStatePanel(currentStateSlug);
      }

      function renderIndiaMarkers() {
        if (!indiaPinsLayer) return {};
        indiaPinsLayer.innerHTML = '';
        const pinsBySlug = {};

        indiaStatesFlat.forEach((state) => {
          const marker = COVERED_STATE_MARKERS.find((m) => m.slug === state.slug);
          if (!marker || !state.stateHead) return;
          const head = state.stateHead;

          const pin = document.createElement('div');
          pin.className = 'map-pin';
          pin.style.left = marker.left;
          pin.style.top = marker.top;
          pin.dataset.slug = state.slug;
          pin.setAttribute('role', 'button');
          pin.setAttribute('tabindex', '0');
          pin.setAttribute('aria-label', `${state.name}, ${state.districtPersonnel.length} team members. Press Enter to view details.`);
          pin.style.setProperty('--breathe-dur', (2.6 + Math.random() * 1.6).toFixed(2) + 's');
          pin.style.setProperty('--breathe-delay', (Math.random() * 2).toFixed(2) + 's');
          pin.style.setProperty('--pulse-jitter', (Math.random() * 1.4).toFixed(2) + 's');

          const topVal = parseFloat(marker.top);
          const leftVal = parseFloat(marker.left);
          let popoverClasses = 'pin-popover';
          if (topVal < 26) popoverClasses += ' popover-below';
          if (leftVal > 76) popoverClasses += ' popover-left';

          const callHref = telHref(head.phoneOfficial) || telHref(head.phonePersonal);
          const callNum = head.phoneOfficial || head.phonePersonal;
          const mailHrefVal = mailHref(head.groupEmail) || mailHref(head.primaryEmail);
          const mailAddr = head.groupEmail || head.primaryEmail;

          pin.innerHTML = `
            <div class="pin-beacon">
              <div class="pin-pulse"></div>
              <div class="pin-ripple"></div>
              <div class="pin-core"></div>
            </div>
            <div class="pin-tag">${marker.code}</div>
            <div class="${popoverClasses}">
              <div class="pop-state">
                <span>📍 ${state.name.toUpperCase()}</span>
                <span class="pop-badge-type">${state.districtPersonnel.length} Personnel</span>
              </div>
              <div class="pop-vendor">${state.name} Regional Team</div>
              <div class="pop-detail-line"><span class="pop-detail-icon">👤</span><span class="pop-detail-text"><strong>State Head:</strong> ${head.empName}${head.designation ? ` (${head.designation})` : ''}</span></div>
              ${callHref ? `<div class="pop-detail-line"><span class="pop-detail-icon">📞</span><span class="pop-detail-text"><strong>Phone:</strong> <a class="pop-link" href="${callHref}">${callNum}</a></span></div>` : ''}
              ${mailHrefVal ? `<div class="pop-detail-line"><span class="pop-detail-icon">✉️</span><span class="pop-detail-text"><strong>Email:</strong> <a class="pop-link" href="${mailHrefVal}">${mailAddr}</a></span></div>` : ''}
              <div class="pop-cta">Click to view details →</div>
            </div>
          `;

          pin.addEventListener('mouseenter', () => { previewIdpState(state.slug); });
          pin.addEventListener('mouseleave', () => { clearIdpPreview(); });
          pin.addEventListener('focus', () => { previewIdpState(state.slug); });
          pin.addEventListener('blur', () => { clearIdpPreview(); });
          pin.addEventListener('click', (e) => { e.stopPropagation(); selectState(state.slug); syncIndiaPinActiveState(state.slug); });
          pin.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectState(state.slug); syncIndiaPinActiveState(state.slug); }
          });

          pinsBySlug[state.slug] = pin;
          indiaPinsLayer.appendChild(pin);
        });

        return pinsBySlug;
      }

      // 3. ACTIVE VENDOR SIDE CARD & QUICK LIST CONTROLLER
      const cardStateName = document.getElementById('cardStateName');
      const cardBadgeType = document.getElementById('cardBadgeType');
      const cardPartnerName = document.getElementById('cardPartnerName');
      const cardOfficer = document.getElementById('cardOfficer');
      const cardAddress = document.getElementById('cardAddress');
      const cardPhoneBtn = document.getElementById('cardPhoneBtn');
      const cardEmailBtn = document.getElementById('cardEmailBtn');
      const mppBody = document.getElementById('mppBody');

      // PERF: these are all static/persistent elements (rule 3), resolving
      // them once avoids re-querying the DOM from inside updateVendorCard(),
      // which used to run its own document.querySelector/querySelectorAll
      // on every single hover event (rule 11: cache DOM selectors).
      const mppHeaderEl = document.querySelector('.mpp-header');
      const routeEls = Array.from(document.querySelectorAll('.mp-route[data-target], .mp-route-particle[data-target]'));

      let activeDataset = worldCountriesData;

      // ── shared selection state machine ──
      // "locked" = the last clicked/activated item per dataset (persists);
      // hovering/focusing any marker, state shape or directory row shows a
      // temporary "preview" that reverts to the locked item on mouse-leave.
      // One set of functions drives markers, state-shape tinting, route
      // brightening and the map "focus" zoom consistently no matter which
      // of those four entry points triggered it.
      // Nothing is locked by default, the panel shows an empty "hover a
      // marker" hint until the user actually interacts with the map.
      const lockedSelection = { india: null, world: null };

      function datasetKey(dataList) {
        return dataList === worldCountriesData ? 'world' : 'india';
      }

      function pinLayerFor(dataList) {
        return dataList === worldCountriesData ? worldPinsLayer : indiaPinsLayer;
      }

      // PERF: the map's <path> elements are static (rule 3, never rebuilt),
      // so it's safe to resolve them once instead of re-running
      // querySelector/querySelectorAll on every single hover. Re-querying
      // the DOM inside a handler that can fire dozens of times a second
      // while the pointer sweeps across the map was a direct contributor
      // to the hover flicker (each query forces a style/layout lookup right
      // before the class-toggle write below, i.e. read-after-write thrashing).
      const statesGroupEl = document.querySelector('.states-group');
      const stateShapeEls = statesGroupEl ? Array.from(statesGroupEl.querySelectorAll('.state-shape')) : [];

      function focusMapOnItem(item, dataList) {
        if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const viewport = dataList === worldCountriesData
          ? document.getElementById('worldMapViewport')
          : document.getElementById('indiaMapViewport');
        if (!viewport) return;
        gsap.to(viewport, {
          duration: .7, ease: 'power3.out', overwrite: 'auto',
          transformOrigin: `${item.left} ${item.top}`,
          scale: 1.07
        });
      }

      function scaleBeacon(pin, scale) {
        if (!pin) return;
        const beacon = pin.querySelector('.pin-beacon');
        if (!beacon) return;
        if (window.gsap) {
          gsap.to(beacon, { scale, duration: .3, ease: scale > 1 ? 'back.out(2.5)' : 'power2.out', overwrite: 'auto' });
        }
      }

      // preview = temporary highlight from hover/focus (map pin, state shape,
      // or directory row), updates the panel + routes + state tint, but
      // does not disturb whichever item is actually locked-in via click.
      //
      // Every one of these three guards `dataList !== activeDataset` first:
      // switching tabs can leave a pin in the now-hidden layer still
      // focused (clicking the tab button itself steals focus from it),
      // and that pin's own blur/mouseleave handler fires regardless of
      // which tab is visible now, without the guard it would reach back
      // into the inactive dataset's lockedSelection and stomp the panel
      // content the tab switch had just set.
      function previewItem(item, dataList) {
        if (dataList !== activeDataset) return;
        // the panel crossfade is the expensive part (GSAP tween touching
        // opacity/transform on two elements), debounced below so it only
        // actually runs once the pointer settles. The marker's own preview
        // state is cheap (a single class toggle + one-element transform)
        // and stays instant so hover feedback on the map itself never lags.
        scheduleVendorCardUpdate(item);
        const pin = item.pinEl;
        if (pin && !pin.classList.contains('active')) {
          pin.classList.add('preview');
          scaleBeacon(pin, 1.25);
        }
      }

      function clearPreview(item, dataList) {
        if (dataList !== activeDataset) return;
        const key = datasetKey(dataList);
        const pin = item.pinEl;
        if (pin && !pin.classList.contains('active')) {
          pin.classList.remove('preview');
          scaleBeacon(pin, 1);
        }

        // details are hover-only, once the mouse leaves, fall back to
        // whichever item is actually locked in (World tab only now —
        // India uses its own drill-down panel, not this dataset), instead
        // of the empty hint.
        const lockedId = lockedSelection[key];
        const lockedItem = lockedId ? dataList.find(d => d.id === lockedId) : null;
        scheduleVendorCardUpdate(lockedItem);
      }

      // lock = a real click/activation (marker, state shape or directory
      // row), persists until a different item is locked.
      function lockItem(item, dataList) {
        if (dataList !== activeDataset) return;
        const key = datasetKey(dataList);
        lockedSelection[key] = item.id;

        const layer = pinLayerFor(dataList);
        if (layer) {
          layer.querySelectorAll('.map-pin').forEach((p) => {
            p.classList.remove('preview');
            p.classList.toggle('active', p.dataset.id === item.id);
            scaleBeacon(p, 1);
          });
        }
        document.querySelectorAll('.quick-location-item').forEach((el) => {
          el.classList.toggle('active', el.dataset.id === item.id);
        });

        updateVendorCard(item);
        focusMapOnItem(item, dataList);
      }

      // bumped on every call so a stale, still-in-flight crossfade from an
      // earlier call (e.g. mouseleave immediately followed by a click or a
      // tab switch) can never overwrite a newer call's content once it
      // finally resolves, only the most recent call is allowed to render.
      let vendorCardToken = 0;

      // HOVER-INTENT DEBOUNCE: the panel crossfade used to fire on every
      // single mouseenter/mouseleave, so sweeping the pointer across several
      // markers (or adjacent state shapes / directory rows) queued a new
      // fade-out/fade-in for each one, visually reading as flicker. Now a
      // preview only schedules the crossfade after the pointer has rested
      // on one target for PANEL_HOVER_DELAY ms; a follow-up hover/leave
      // within that window just reschedules it, so a fast sweep collapses
      // to a single crossfade on whichever item the pointer actually stops on.
      let panelUpdateTimer = null;
      const PANEL_HOVER_DELAY = 70;

      function scheduleVendorCardUpdate(item) {
        clearTimeout(panelUpdateTimer);
        panelUpdateTimer = setTimeout(() => {
          panelUpdateTimer = null;
          updateVendorCard(item);
        }, PANEL_HOVER_DELAY);
      }

      function updateVendorCard(item) {
        // route highlighting runs regardless of whether a details card is
        // present — the international map no longer has one (see the
        // removed #vendorLiveCard / .world-bottom-grid), but its markers
        // should still light up the matching logistics route on hover.
        routeEls.forEach(r => {
          r.classList.toggle('is-active-route', !!item && r.dataset.target === item.id);
        });

        if (!cardStateName) return;
        // a direct/immediate call (click-lock, tab switch) always wins over
        // whatever transient hover was still pending
        clearTimeout(panelUpdateTimer);
        panelUpdateTimer = null;
        const myToken = ++vendorCardToken;

        const applyContent = () => {
          if (myToken !== vendorCardToken) return;
          if (item) {
            cardStateName.innerHTML = `📍 ${item.name} <span class="mpp-hq-badge" id="cardBadgeType">${item.hubType || 'Regional Hub'}</span>`;
            if (cardPartnerName) cardPartnerName.textContent = item.partner;
            if (cardOfficer) cardOfficer.textContent = item.officer;
            if (cardAddress) cardAddress.textContent = item.address;
            if (cardPhoneBtn) cardPhoneBtn.href = `tel:${item.phone.replace(/\s+/g, '')}`;
            if (cardEmailBtn) cardEmailBtn.href = `mailto:${item.email}`;
            if (mppBody) mppBody.classList.remove('is-empty');
          } else {
            cardStateName.innerHTML = `<span class="mpp-empty-icon" aria-hidden="true">🗺️</span> Hover a Marker`;
            if (cardPartnerName) cardPartnerName.textContent = '';
            if (mppBody) mppBody.classList.add('is-empty');
          }
        };

        // Instant swap: the state name/vendor details replace immediately,
        // no fade/slide crossfade, kill any leftover tween from an earlier
        // in-flight call so it can't still land and re-animate this content.
        const targets = [mppHeaderEl, mppBody].filter(Boolean);
        if (window.gsap && targets.length) gsap.killTweensOf(targets);
        applyContent();
      }

      // 4. RENDER MAP OVERLAY PINS
      function renderPins(dataList, containerEl) {
        if (!containerEl) return;
        containerEl.innerHTML = '';

        dataList.forEach(item => {
          const pin = document.createElement('div');
          const isLocked = item.id === lockedSelection[datasetKey(dataList)];
          pin.className = 'map-pin' + (item.isHQ ? ' is-hq' : '') + (isLocked ? ' active' : '');
          pin.style.left = item.left;
          pin.style.top = item.top;
          pin.dataset.id = item.id;
          pin.setAttribute('role', 'button');
          pin.setAttribute('tabindex', '0');
          pin.setAttribute('aria-label', `${item.name}, ${item.hubType || 'Regional Hub'}. Press Enter to view details.`);

          // independent animation timing per marker so the map "breathes"
          // organically rather than every beacon pulsing in lockstep
          pin.style.setProperty('--breathe-dur', (2.6 + Math.random() * 1.6).toFixed(2) + 's');
          pin.style.setProperty('--breathe-delay', (Math.random() * 2).toFixed(2) + 's');
          pin.style.setProperty('--pulse-jitter', (Math.random() * 1.4).toFixed(2) + 's');

          const topVal = parseFloat(item.top);
          const leftVal = parseFloat(item.left);

          let popoverClasses = 'pin-popover';
          if (topVal < 26) {
            popoverClasses += ' popover-below';
          }
          if (leftVal > 76) {
            popoverClasses += ' popover-left';
          }

          pin.innerHTML = `
            <div class="pin-beacon">
              <div class="pin-pulse"></div>
              <div class="pin-ripple"></div>
              <div class="pin-core"></div>
            </div>
            <div class="pin-tag">${item.code}</div>
            <div class="${popoverClasses}">
              <div class="pop-state">
                <span>📍 ${item.name}</span>
                <span class="pop-badge-type">${item.hubType || 'Regional Hub'}</span>
              </div>
              <div class="pop-vendor">${item.partner}</div>
              <div class="pop-detail-line"><span class="pop-detail-icon">👤</span><span class="pop-detail-text"><strong>Officer:</strong> ${item.officer}</span></div>
              <div class="pop-detail-line"><span class="pop-detail-icon">📞</span><span class="pop-detail-text"><strong>Phone:</strong> <a class="pop-link" href="tel:${item.phone.replace(/\s+/g, '')}">${item.phone}</a></span></div>
              <div class="pop-detail-line"><span class="pop-detail-icon">✉️</span><span class="pop-detail-text"><strong>Email:</strong> <a class="pop-link" href="mailto:${item.email}">${item.email}</a></span></div>
              <div class="pop-detail-line" style="border-top:1px solid var(--border); padding-top:0.35rem; margin-top:0.35rem;"><span class="pop-detail-icon">🏬</span><span class="pop-detail-text"><strong>Hub:</strong> ${item.address}</span></div>
              <div class="pop-icons" aria-hidden="true" title="Rail · Manufacturing · Power Grid">🚂 🏭 ⚡</div>
              <div class="pop-cta">Click to view details →</div>
            </div>
          `;

          pin.addEventListener('mouseenter', () => previewItem(item, dataList));
          pin.addEventListener('mouseleave', () => clearPreview(item, dataList));
          pin.addEventListener('focus', () => previewItem(item, dataList));
          pin.addEventListener('blur', () => clearPreview(item, dataList));

          pin.addEventListener('click', (e) => {
            e.stopPropagation();
            lockItem(item, dataList);
          });

          pin.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              lockItem(item, dataList);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              const pins = Array.from(containerEl.querySelectorAll('.map-pin'));
              const idx = pins.indexOf(pin);
              const dir = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
              const next = pins[(idx + dir + pins.length) % pins.length];
              if (next) next.focus();
            }
          });

          // cache the element on the data item itself, pins are created
          // once here and never rebuilt (rule 3), so previewItem/clearPreview
          // can read item.pinEl directly instead of re-querying the DOM by
          // attribute selector on every hover (rule 11)
          item.pinEl = pin;

          containerEl.appendChild(pin);
        });
      }

      const worldPinsLayer = document.getElementById('worldPinsLayer');
      const indiaPinsLayer = document.getElementById('pinsLayer');
      renderPins(worldCountriesData, worldPinsLayer);

      // 4b. WORLD BOTTOM CARDS: static country-name chip list (reuses the
      // .quick-location-item markup/interaction so hovering or clicking a
      // chip still highlights its marker + route on the map) plus the map's
      // one real HQ record (in_hq) — the lighter replacement for the old
      // hover-driven vendor-details sidebar (#vendorLiveCard).
      const worldCountryChips = document.getElementById('worldCountryChips');

      function renderWorldCountryChips() {
        if (!worldCountryChips) return;
        worldCountriesData.filter((item) => !item.isHQ).forEach((item) => {
          const chip = document.createElement('div');
          chip.className = 'quick-location-item';
          chip.dataset.id = item.id;
          chip.setAttribute('role', 'button');
          chip.setAttribute('tabindex', '0');
          chip.setAttribute('aria-label', `${item.name} (${item.code}), highlight on map`);
          chip.innerHTML = `<span class="ql-indicator" aria-hidden="true"></span><span class="ql-icon" aria-hidden="true">📍</span><span class="ql-name">${item.name}</span><span class="ql-code">${item.code}</span>`;

          chip.addEventListener('mouseenter', () => previewItem(item, worldCountriesData));
          chip.addEventListener('mouseleave', () => clearPreview(item, worldCountriesData));
          chip.addEventListener('focus', () => previewItem(item, worldCountriesData));
          chip.addEventListener('blur', () => clearPreview(item, worldCountriesData));

          const activate = () => lockItem(item, worldCountriesData);
          chip.addEventListener('click', activate);
          chip.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              activate();
            }
          });

          worldCountryChips.appendChild(chip);
        });
      }
      renderWorldCountryChips();

      const worldHqEntry = worldCountriesData.find((item) => item.isHQ);
      if (worldHqEntry) {
        const worldHqAddress = document.getElementById('worldHqAddress');
        const worldHqPhone = document.getElementById('worldHqPhone');
        const worldHqEmail = document.getElementById('worldHqEmail');
        if (worldHqAddress) worldHqAddress.textContent = worldHqEntry.address;
        if (worldHqPhone) worldHqPhone.textContent = worldHqEntry.phone;
        if (worldHqEmail) worldHqEmail.textContent = worldHqEntry.email;
      }

      // 5. STATE / COUNTRY SHAPE HOVER: native tooltip with the region's
      // name (India's <path> shapes have no <title>, unlike the world
      // map's) + sync the info panel & active pin when a shape maps to a
      // known depot, so the whole colored region is interactive, not just
      // the small pin dot inside it.
      function slugToStateName(slug) {
        return slug.split('-').map(w => w === 'and' ? 'and' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }

            const indiaPinsBySlug = renderIndiaMarkers();

      document.querySelectorAll('.state-shape[data-state]').forEach((shape) => {
        const slug = shape.dataset.state;
        const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleEl.textContent = slugToStateName(slug);
        shape.insertBefore(titleEl, shape.firstChild);

        const state = findState(slug);
        if (state) {
          shape.classList.add('state-covered');
          // hovering the shape previews the state AND shows its matching
          // bubble's popover, so map-shape hover and pin hover read as the
          // same interaction no matter which one the pointer is actually over
          const pin = indiaPinsBySlug[slug];
          shape.addEventListener('mouseenter', () => {
            previewIdpState(slug);
            if (pin && !pin.classList.contains('active')) pin.classList.add('preview');
          });
          shape.addEventListener('mouseleave', () => {
            clearIdpPreview();
            if (pin) pin.classList.remove('preview');
          });
          shape.addEventListener('click', () => { selectState(slug); syncIndiaPinActiveState(slug); });
        }
      });

      // Default landing view: West Bengal (HQ) state-head/vendor details,
      // pre-selected on the map, instead of the empty "All States" grid.
      renderStateList();
      renderStatePanel(currentStateSlug);
      syncIndiaPinActiveState(currentStateSlug);

      const tabWorldBtn = document.getElementById('tabWorldBtn');
      const tabIndiaBtn = document.getElementById('tabIndiaBtn');
      const worldMapWrap = document.getElementById('worldMapWrap');
      const indiaMapWrap = document.getElementById('indiaMapWrap');
      const marketDashboardGrid = document.getElementById('marketDashboardGrid');

      if (tabWorldBtn && tabIndiaBtn) {
        tabWorldBtn.addEventListener('click', () => {
          tabWorldBtn.classList.add('active');
          tabIndiaBtn.classList.remove('active');
          if (window.mpSwitchMapTab) window.mpSwitchMapTab(worldMapWrap, indiaMapWrap);
          else { worldMapWrap.style.display = 'block'; indiaMapWrap.style.display = 'none'; }
          activeDataset = worldCountriesData;
          const current = lockedSelection.world ? worldCountriesData.find(d => d.id === lockedSelection.world) : null;
          updateVendorCard(current);
          // international tab has no side console anymore, let the map
          // column take the full grid width (domestic tab is untouched)
          if (marketDashboardGrid) marketDashboardGrid.classList.add('mp-tab-world');
          if (indiaDrillPanel) indiaDrillPanel.style.display = 'none';
          closeDistrictPopup();
        });

        tabIndiaBtn.addEventListener('click', () => {
          tabIndiaBtn.classList.add('active');
          tabWorldBtn.classList.remove('active');
          if (window.mpSwitchMapTab) window.mpSwitchMapTab(indiaMapWrap, worldMapWrap);
          else { indiaMapWrap.style.display = 'block'; worldMapWrap.style.display = 'none'; }
          if (marketDashboardGrid) marketDashboardGrid.classList.remove('mp-tab-world');
          if (indiaDrillPanel) indiaDrillPanel.style.display = '';
          renderStatePanel(currentStateSlug);
          syncIndiaPinActiveState(currentStateSlug);
        });
      }
    })();
  