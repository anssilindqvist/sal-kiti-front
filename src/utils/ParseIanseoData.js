/**
 * Parses Ianseo ASC CSV data to results objects
 *
 * @param {array} data
 * @returns {array} list of results objects
 */

export default function (data, resultTypes) {
  let results = [];
  let headers = {
    sport_id: 1,
    division: 2,
    category: 3,
    name: 4,
    organization: 5,
    result: 7,
    tens: 8,
    xs: 9,
    position: 14,
    part1: 16,
    part2: 19,
    part3: 22,
    part4: 25
  };
  let elimHeaders = {
    sport_id: 1,
    division: 2,
    category: 3,
    elimination_category: 6,
    round: 7,
    position: 9
  };
  let teamHeaders = {
    organization: 1,
    category: 2,
    result: 3,
    tens: 4,
    xs: 5,
    position: 9,
    sport_id_a: 10,
    sport_id_b: 11,
    sport_id_c: 12
  };
  let divisions = new Map();
  divisions.set("C", "T");
  divisions.set("B", "V");
  divisions.set("BB", "V");
  divisions.set("LB", "LB");
  divisions.set("L", "LB");
  divisions.set("R", "");
  let categories = new Map();
  categories.set("J5", "15");
  categories.set("T5", "T15");
  categories.set("J5T", "15T");
  categories.set("T5T", "T15T");
  categories.set("J5V", "15V");
  categories.set("T5V", "T15V");
  categories.set("J5L", "15LB");
  categories.set("T5L", "T15LB");
  categories.set("J7", "17");
  categories.set("T7", "T17");
  categories.set("J7T", "17T");
  categories.set("T7T", "T17T");
  categories.set("J7V", "17V");
  categories.set("T7V", "T17V");
  categories.set("J7L", "17LB");
  categories.set("T7L", "T17lB");
  categories.set("N2", "N20");
  categories.set("N2T", "N20T");
  categories.set("N2V", "N20V");
  categories.set("N2L", "N20LB");
  categories.set("J15", "15");
  categories.set("J15T", "15T");
  categories.set("J15V", "15V");
  categories.set("J15L", "15LB");
  categories.set("J17", "17");
  categories.set("J17T", "17T");
  categories.set("J17V", "17V");
  categories.set("J17L", "17LB");
  categories.set("Y20", "20");
  categories.set("Y20T", "20T");
  categories.set("Y20V", "20V");
  categories.set("Y20L", "20LB");
  categories.set("Y50", "50");
  categories.set("Y50T", "50T");
  categories.set("Y50V", "50V");
  categories.set("Y50L", "50LB");
  categories.set("N5", "N50");
  categories.set("N5T", "N50T");
  categories.set("N5V", "N50V");
  categories.set("N5L", "N50LB");
  categories.set("Y60", "60");
  categories.set("Y60T", "60T");
  categories.set("Y60V", "60V");
  categories.set("Y60L", "60LB");
  categories.set("N6", "N60");
  categories.set("N6T", "N60T");
  categories.set("N6V", "N60V");
  categories.set("N6L", "N60LB");
  categories.set("Y70", "70");
  categories.set("Y70T", "70T");
  categories.set("Y70V", "70V");
  categories.set("Y70L", "70LB");
  categories.set("N7", "N70");
  categories.set("N7T", "N70T");
  categories.set("N7V", "N70V");
  categories.set("N7L", "N70LB");
  let resultTypeKeys = [];
  resultTypes.forEach((resultType) => {
    resultTypeKeys.push(resultType.abbreviation);
  });
  let higherCount = null;
  let lowerCount = null;
  if (resultTypeKeys.includes("x") && resultTypeKeys.includes("10")) {
    higherCount = "x-1";
    lowerCount = "10-1";
  } else if (resultTypeKeys.includes("10") && resultTypeKeys.includes("9")) {
    higherCount = "10-1";
    lowerCount = "9-1";
  } else if (resultTypeKeys.includes("6") && resultTypeKeys.includes("5")) {
    higherCount = "6-1";
    lowerCount = "5-1";
  } else if (resultTypeKeys.includes("11") && resultTypeKeys.includes("10")) {
    higherCount = "11-1";
    lowerCount = "10-1";
  }
  let part1 = null;
  let part2 = null;
  let part3 = null;
  let part4 = null;
  if (resultTypeKeys.includes("part")) {
    part1 = "part-1";
    part2 = "part-2";
    part3 = "part-3";
    part4 = "part-4";
  } else if (resultTypeKeys.includes("30n")) {
    part1 = "30n-1";
    part2 = "30n-2";
    part3 = "30n-3";
    part4 = "30n-4";
  } else if (resultTypeKeys.includes("36n")) {
    part1 = "36n-1";
    part2 = "36n-2";
    part3 = "36n-3";
    part4 = "36n-4";
  } else if (resultTypeKeys.includes("90m")) {
    part1 = "90m-1";
    part2 = "70m-1";
    part3 = "50m-1";
    part4 = "30m-1";
  } else if (resultTypeKeys.includes("60m")) {
    part1 = "60m-1";
    part2 = "50m-1";
    part3 = "40m-1";
  } else if (resultTypeKeys.includes("25m")) {
    part1 = "18m-1";
    part2 = "25m-1";
  }
  for (const row in data) {
    if (data[row][0] === "1") {
      let result = {};
      result.partial = [];
      result.sport_id = data[row][headers.sport_id];
      let division = data[row][headers.division];
      if (divisions.has(division)) {
        division = divisions.get(division);
      }
      let category = data[row][headers.category];
      if (categories.has(category)) {
        category = categories.get(category);
      }
      result.category = category.concat(division);
      let names = data[row][headers.name].split(" ");
      result.last_name = names[0];
      if (names.length > 1) {
        result.first_name = names[1];
      } else {
        result.first_name = "";
      }
      result.organization = data[row][headers.organization];
      if (data[row][headers.result] && parseInt(data[row][headers.result])) {
        result.result = parseInt(data[row][headers.result]);
      }
      if (
        data[row][headers.position] &&
        parseInt(data[row][headers.position])
      ) {
        result.position_pre = parseInt(data[row][headers.position]);
      }
      if (data[row][headers.xs] && parseInt(data[row][headers.xs])) {
        result[higherCount] = parseInt(data[row][headers.xs]);
      }
      if (data[row][headers.tens] && parseInt(data[row][headers.tens])) {
        result[lowerCount] = parseInt(data[row][headers.tens]);
      }
      if (
        part1 &&
        data[row][headers.part1] &&
        parseInt(data[row][headers.part1])
      ) {
        result[part1] = parseInt(data[row][headers.part1]);
      }
      if (
        part2 &&
        data[row][headers.part2] &&
        parseInt(data[row][headers.part2])
      ) {
        result[part2] = parseInt(data[row][headers.part2]);
      }
      if (
        part3 &&
        data[row][headers.part3] &&
        parseInt(data[row][headers.part3])
      ) {
        result[part3] = parseInt(data[row][headers.part3]);
      }
      if (
        part4 &&
        data[row][headers.part4] &&
        parseInt(data[row][headers.part4])
      ) {
        result[part4] = parseInt(data[row][headers.part4]);
      }
      results.push(result);
    } else if (data[row][0] === "2") {
      let sport_id = data[row][elimHeaders.sport_id];
      let division = data[row][elimHeaders.division];
      if (divisions.has(division)) {
        division = divisions.get(division);
      }
      let category = data[row][elimHeaders.category];
      if (categories.has(category)) {
        category = categories.get(category);
      }
      category = category.concat(division);
      let index = results.findIndex(
        (res) => res.sport_id === sport_id && res.category === category
      );
      if (index >= 0) {
        let elimination_category = data[row][elimHeaders.elimination_category];
        if (divisions.get(elimination_category.charAt(0)) !== undefined) {
          let division = divisions.get(elimination_category.charAt(0));
          elimination_category = elimination_category
            .substr(1)
            .concat(division);
        }
        if (categories.has(elimination_category)) {
          elimination_category = categories.get(elimination_category);
        }
        results[index].elimination_category = elimination_category;
        let position = parseInt(data[row][elimHeaders.position]);
        if (position) {
          results[index].position = position;
        } else {
          results[index].position = results[index].position_pre;
        }
        if (position) {
          let round = data[row][elimHeaders.round].split("|")[1];
          if (round >= 2 && position <= 4) {
            if (data[row].slice(-1)[0].split("|")[0] !== undefined) {
              results[index]["fin-1"] = data[row].slice(-1)[0].split("|")[0];
            }
            if (data[row].slice(-2)[0].split("|")[0] !== undefined) {
              results[index]["fin-2"] = data[row].slice(-2)[0].split("|")[0];
            }
          }
          if (round >= 4 && position <= 8) {
            if (data[row].slice(-3)[0].split("|")[0] !== undefined) {
              results[index]["fin-3"] = data[row].slice(-3)[0].split("|")[0];
            }
          }
          if (round >= 8 && position <= 16) {
            if (data[row].slice(-4)[0].split("|")[0] !== undefined) {
              results[index]["fin-4"] = data[row].slice(-4)[0].split("|")[0];
            }
          }
          if (round >= 16 && position <= 32) {
            if (data[row].slice(-5)[0].split("|")[0] !== undefined) {
              results[index]["fin-5"] = data[row].slice(-5)[0].split("|")[0];
            }
          }
          if (round >= 24 && position <= 48) {
            if (data[row].slice(-6)[0].split("|")[0] !== undefined) {
              results[index]["fin-6"] = data[row].slice(-6)[0].split("|")[0];
            }
          }
          if (round >= 48 && position <= 104) {
            if (parseInt(data[row].slice(-7)[0].split("|")[0]) !== undefined) {
              results[index]["fin-7"] = data[row].slice(-7)[0].split("|")[0];
            }
          }
        }
      }
    } else if (data[row][0] === "8") {
      let result = {};
      result.organization = data[row][teamHeaders.organization];
      if (
        data[row][teamHeaders.result] &&
        parseInt(data[row][teamHeaders.result])
      ) {
        result.result = parseInt(data[row][teamHeaders.result]);
      }
      if (
        data[row][teamHeaders.position] &&
        parseInt(data[row][teamHeaders.position])
      ) {
        result.position = parseInt(data[row][teamHeaders.position]);
      }
      if (
        data[row][teamHeaders.tens] &&
        parseInt(data[row][teamHeaders.tens])
      ) {
        result[lowerCount] = parseInt(data[row][teamHeaders.tens]);
      }
      if (data[row][teamHeaders.xs] && parseInt(data[row][teamHeaders.xs])) {
        result[higherCount] = parseInt(data[row][teamHeaders.xs]);
      }
      let category = data[row][teamHeaders.category];
      if (categories.has(category)) {
        category = categories.get(category);
      }
      if (data[row][teamHeaders.sport_id_a]) {
        result["sport_id_a"] = data[row][teamHeaders.sport_id_a];
      }
      if (data[row][teamHeaders.sport_id_b]) {
        result["sport_id_b"] = data[row][teamHeaders.sport_id_b];
      }
      if (data[row][teamHeaders.sport_id_c]) {
        result["sport_id_c"] = data[row][teamHeaders.sport_id_c];
      }
      result["category"] = category;
      let teamCount = results.filter(
        (res) =>
          "team_name" in res &&
          res["team_name"].startsWith(result.organization.concat(" "))
      ).length;
      teamCount++;
      result["team_name"] = result.organization
        .concat(" ")
        .concat(teamCount.toString());
      results.push(result);
    }
  }
  return results;
}
