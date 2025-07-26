
// import stringSimilarity from 'string-similarity' -> old and not available any more
import stringComparison from 'string-comparison'

function check_stringSimilarity(s1, s2) {
    console.log("String 1 is, ", s1)
    console.log("String 2 is, ", s2)
    console.log("String Similarity Score is -> ", stringComparison.jaroWinkler.similarity(s1.toLowerCase(), s2.toLowerCase()))

}

check_stringSimilarity("debian", "Debian");