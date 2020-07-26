const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { listenerCount } = require("process");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const employees = [];
const mgrAddlDetail = "office number";
const engrAddlDetail = "github username";
const internAddlDetail = "school name";
let hireMoreMembers_g = "no";
let managersAdded = 0;
hireTeamMember();
async function hireTeamMember() {
    try {
        const { name } = await inquirer.prompt({
            message: "Name of Team Member :",
            name: "name",
        });
        console.log("NNAME", name);

        let promptAgain = false;

        do {
            promptAgain = false;
            var { id } = await inquirer.prompt({
                message: "Id of Team Member :",
                name: "id",
            });
            if (isNaN(id)) {
                console.log("Not a number:", "Please provide a number for id");
                promptAgain = true;
            }
            if (employees.length > 0) {
                const sameId = employees.filter(function(empl) {
                    return id === empl.id;
                });
                if (sameId.length > 0) {
                    console.log("duplicate id", "provide unique employee id");
                    promptAgain = true;
                }
            }
            console.log("id", id);
        } while (promptAgain === true);

        const { email } = await inquirer.prompt({
            message: "Email of Team Member :",
            name: "email",
        });
        const { role } = await inquirer.prompt({
            type: "list",
            message: "Role of Team Member :",
            choices: ["Engineer", "Intern", "Manager"],
            name: "role",
        });

        let addlDetailMsg = "";
        if (role === "Engineer") {
            addlDetailMsg = "GitHub username";
        } else if (role === "Intern") {
            addlDetailMsg = "school name";
        } else {
            addlDetailMsg = "office phone number";
        }
        const { addlDetail } = await inquirer.prompt({
            message: `Enter team member's ${addlDetailMsg}`,
            name: "addlDetail",
        });

        const { hireMoreMembers } = await inquirer.prompt({
            type: "list",
            message: "Hire more Members:",
            choices: ["yes", "no"],
            name: "hireMoreMembers",
        });
        hireMoreMembers_g = hireMoreMembers;
        console.log("hiremoremembers", hireMoreMembers);
        switch (role) {
            case "Manager":
                if (managersAdded < 1) {
                    employees.push(new Manager(name, id, email, addlDetail));
                    managersAdded++;
                } else {
                    console.log("Only one Manager allowed in the team");
                }
                break;
            case "Engineer":
                employees.push(new Engineer(name, id, email, addlDetail));
                break;
            case "Intern":
                employees.push(new Intern(name, id, email, addlDetail));
                break;
        }
    } catch (err) {
        console.log(err);
    }
    console.log("hiremoremembers", hireMoreMembers_g);
    if (hireMoreMembers_g == "yes") {
        hireTeamMember();
    } else {
        const html = render(employees);
        fs.writeFileSync(outputPath, html, "utf8");
        return;
    }
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```