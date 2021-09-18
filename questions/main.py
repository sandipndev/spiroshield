from dotenv import load_dotenv
import os
import openai
import json
from flask import Flask, request, jsonify

passage = ""
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

def genResponse(input_prompt, pval=1, temperature=0.9):
  response = openai.Completion.create(
    engine="curie",
    prompt= input_prompt,
    temperature=temperature,
    max_tokens=64,
    top_p=pval,
    frequency_penalty=0,
    presence_penalty=0,
    stop=["\n"]
  )
  return response['choices'][0]['text']

@app.route("/", methods=["POST"])
def genQuestions():
  data = request.json
  
  questionCount = data["questionCount"]
  document = data["document"]

  baseprompt="Create multiple-choice questions and the correct answer based on this passage:\n\"\"\"\nThe lipid bilayer is a universal component of all cell membranes. Its role is critical because its structural components provide the barrier that marks the boundaries of a cell. The structure is called a \"lipid bilayer\" because it is composed of two layers of fat cells organized in two sheets. The lipid bilayer is typically about five nanometers thick and surrounds all cells providing the cell membrane structure.\n\nThe structure of the lipid bilayer explains its function as a barrier. Lipids are fats, like oil, that are insoluble in water. There are two important regions of a lipid that provide the structure of the lipid bilayer. Each lipid molecule contains a hydrophilic region, also called a polar head region, and a hydrophobic, or nonpolar tail region.\nThe hydrophilic region is attracted to aqueous water conditions while the hydrophobic region is repelled from such conditions. Since a lipid molecule contains regions that are both polar and nonpolar, they are called amphipathic molecules.\nThe most abundant class of lipid molecules found in cell membranes is the phospholipid. The phospholipid molecule's polar head group contains a phosphate group. It also sports two nonpolar fatty acid chain groups as its tail. The fatty acid tail is composed of a string of carbons and hydrogens. It has a kink in one of the chains because of its double-bond structure.\n\nThe phospholipids organize themselves in a bilayer to hide their hydrophobic tail regions and expose the hydrophilic regions to water. This organization is spontaneous, meaning it is a natural process and does not require energy. This structure forms the layer that is the wall between the inside and outside of the cell.\n\nIntegral proteins are embedded within the lipid bilayer. They cannot easily be removed from the cell membrane without the use of harsh detergents that destroy the lipid bilayer. Integral proteins float rather freely within the bilayer, much like oceans in the sea. In addition, integral proteins are usually transmembrane proteins, extending through the lipid bilayer so that one end contacts the interior of the cell and the other touches the exterior. The stretch of the integral protein within the hydrophobic interior of the bilayer is also hydrophobic, made up of non-polar amino acids. Like the lipid bilayer, the exposed ends of the integral protein are hydrophilic.\nWhen a protein crosses the lipid bilayer it adopts an alpha-helical configuration. Transmembrane proteins can either cross the lipid bilayer one or multiple times. The former is referred to as single-pass proteins and the latter as multi-pass proteins. As a result of their structure, transmembrane proteins are the only class of proteins that can perform functions both inside and outside of the cell.\n\nPeripheral proteins are attached to the exterior of the lipid bilayer. They are easily separable from the lipid bilayer, able to be removed without harming the bilayer in any way. Peripheral proteins are less mobile within the lipid bilayer.\n\"\"\"\n\nMultiple-choice questions based on the passage:\n\"\"\"\nQuestion: What is the most abundant class of lipid molecules found in cell membranes?\nAnswer choices: A. Phospholipids; B. Triglycerides; C. Hormones; D. Fatty Acids\nCorrect answer: A\n\nQuestion: What type of lipid molecule has a polar head group and two nonpolar fatty acid chain groups as its tail?\nAnswer choices: A. Phospholipids; B. Triglycerides; C. Hormones; D. Fatty acids\nCorrect answer: A\n\nQuestion: Which of the following is not a correct statement about the hydrophilic region of a phospholipid molecule?\nAnswer choices: A. It is attracted to aqueous water conditions; B. It is repelled from water; C. It contains a phosphate group; D. It contains a polar head group.\nCorrect answer: B\n\nQuestion: Which of the following is true of integral proteins?\nAnswer choices: A. They are non-polar; B. They are embedded within the lipid bilayer; C. They are only located inside the cell; D. They are only located outside the cell.\nCorrect answer: B\n\"\"\""
  generatedJsons = []
  generatedQuestions = []
  for a in range(questionCount):
    qdict = {}
    newprompt = "Create multiple-choice questions and the correct answer based on this passage:\n\"\"\"\n" + document + "\n\"\"\"\n\nMultiple-choice questions and their correct answers based on the previous passage:\n\"\"\"\nQuestion:"

    #Add new passage to the input
    inp = baseprompt + newprompt

    #Generate question, if question already exists, regenerate up to a maximum of three tries.
    question = genResponse(inp)
    for x in range(3):
      if question in generatedQuestions:
        question = genResponse(inp)
      else:
        generatedQuestions.append(question)
        qdict["q"] = question[1:]
        break

    #Generates answer choices based on the question
    inp += qdict["q"] + "\nAnswer choices:"
    ansChoice = genResponse(inp)

    #Generates answer choices, processes it and stores it in dictionary
    ansChoiceList = ansChoice.split(";")
    for x in range(3):
      if len(ansChoiceList)!=4:
        ansChoice = genResponse(inp)
        ansChoiceList = ansChoice.split(";")
      else:
        inp += ansChoice + "\nCorrect Answer:"
        break

    for a in range(len(ansChoiceList)):
      ansChoiceList[a] = ansChoiceList[a][4:]
    qdict["opts"] = ansChoiceList

    correctAns = genResponse(inp, pval=0, temperature=0.5)
    for x in range(3):
      if len(correctAns)!=2:
        correctAns = genResponse(inp, pval=0, temperature=0.5)
      else:
        break
    correctAns = correctAns[1]
    ind = ord(correctAns.lower()) - 97
    qdict["correct_ans_idx"] = ind
    generatedJsons.append(json.dumps(qdict))
  return jsonify(generatedJsons)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)