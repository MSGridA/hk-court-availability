export const DISTRICT_GROUPS = [
  {
    id: "hk-island",
    label: "HK Island",
    labelTC: "香港島",
    districts: [
      { value: "Central & Western", label: "Central & Western", labelTC: "中西區" },
      { value: "Eastern", label: "Eastern", labelTC: "東區" },
      { value: "Southern", label: "Southern", labelTC: "南區" },
      { value: "Wan Chai", label: "Wan Chai", labelTC: "灣仔區" },
    ],
  },
  {
    id: "kowloon",
    label: "Kowloon",
    labelTC: "九龍",
    districts: [
      { value: "Kowloon City", label: "Kowloon City", labelTC: "九龍城區" },
      { value: "Kwun Tong", label: "Kwun Tong", labelTC: "觀塘區" },
      { value: "Sham Shui Po", label: "Sham Shui Po", labelTC: "深水埗區" },
      { value: "Wong Tai Sin", label: "Wong Tai Sin", labelTC: "黃大仙區" },
      { value: "Yau Tsim Mong", label: "Yau Tsim Mong", labelTC: "油尖旺區" },
    ],
  },
  {
    id: "new-territories",
    label: "New Territories",
    labelTC: "新界",
    districts: [
      { value: "Islands", label: "Islands", labelTC: "離島區" },
      { value: "Kwai Tsing", label: "Kwai Tsing", labelTC: "葵青區" },
      { value: "North", label: "North", labelTC: "北區" },
      { value: "Sai Kung", label: "Sai Kung", labelTC: "西貢區" },
      { value: "Sha Tin", label: "Sha Tin", labelTC: "沙田區" },
      { value: "Tai Po", label: "Tai Po", labelTC: "大埔區" },
      { value: "Tsuen Wan", label: "Tsuen Wan", labelTC: "荃灣區" },
      { value: "Tuen Mun", label: "Tuen Mun", labelTC: "屯門區" },
      { value: "Yuen Long", label: "Yuen Long", labelTC: "元朗區" },
    ],
  },
];

export const LCSD_DISTRICTS = DISTRICT_GROUPS.flatMap((group) => group.districts);
