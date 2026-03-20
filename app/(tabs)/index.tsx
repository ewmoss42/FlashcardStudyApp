import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Flashcard = {
  question: string;
  answer: string;
  image: string;
  choices: string[];
};

export default function HomeScreen() {
  const [screen, setScreen] = useState("welcome");

  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      question: "What language is commonly used with React Native?",
      answer: "JavaScript",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      choices: ["Python", "JavaScript", "Swift"],
    },
    {
      question: "What app lets you test Expo projects on an iPhone?",
      answer: "Expo Go",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      choices: ["Expo Go", "Xcode", "GitHub"],
    },
    {
      question: "What command creates a new Expo project?",
      answer: "create-expo-app",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      choices: ["npm start", "create-react-app", "create-expo-app"],
    },
  ]);

  const [editCards, setEditCards] = useState([
    {
      question: "What language is commonly used with React Native?",
      answer: "JavaScript",
    },
    {
      question: "What app lets you test Expo projects on an iPhone?",
      answer: "Expo Go",
    },
    {
      question: "What command creates a new Expo project?",
      answer: "create-expo-app",
    },
  ]);

  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [answered, setAnswered] = useState(false);

  const startFlashcards = () => {
    setCardIndex(0);
    setShowAnswer(false);
    setScreen("flashcards");
  };

  const startQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setFeedback("");
    setAnswered(false);
    setScreen("quiz");
  };

  const nextCard = () => {
    setCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const checkAnswer = (choice: string) => {
    if (answered) return;

    if (choice === flashcards[quizIndex].answer) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`Incorrect. Correct answer: ${flashcards[quizIndex].answer}`);
    }

    setAnswered(true);
  };

  const nextQuestion = () => {
    if (quizIndex < flashcards.length - 1) {
      setQuizIndex((prevIndex) => prevIndex + 1);
      setFeedback("");
      setAnswered(false);
    } else {
      setScreen("results");
    }
  };

  const goToMenu = () => {
    setFeedback("");
    setAnswered(false);
    setShowAnswer(false);
    setScreen("menu");
  };

  const updateEditQuestion = (index: number, text: string) => {
    const updatedCards = [...editCards];
    updatedCards[index].question = text;
    setEditCards(updatedCards);
  };

  const updateEditAnswer = (index: number, text: string) => {
    const updatedCards = [...editCards];
    updatedCards[index].answer = text;
    setEditCards(updatedCards);
  };

  const saveEditedCards = () => {
    const updatedFlashcards: Flashcard[] = flashcards.map((card, index) => ({
      ...card,
      question: editCards[index].question,
      answer: editCards[index].answer,
      choices: [
        editCards[index].answer,
        `Choice ${index + 1}B`,
        `Choice ${index + 1}C`,
      ],
    }));

    setFlashcards(updatedFlashcards);
    setScreen("menu");
  };

  if (screen === "welcome") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Flashcard Study App</Text>
        <Text style={styles.subtitle}>
          Study with flashcards, take a quiz, or edit the questions.
        </Text>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setScreen("menu")}
        >
          <Text style={styles.buttonText}>Enter App</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === "menu") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Main Menu</Text>
        <Text style={styles.subtitle}>Choose a mode below.</Text>

        <TouchableOpacity style={styles.mainButton} onPress={startFlashcards}>
          <Text style={styles.buttonText}>Study Flashcards</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mainButton} onPress={startQuiz}>
          <Text style={styles.buttonText}>Take Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setScreen("edit")}
        >
          <Text style={styles.buttonText}>Edit Questions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === "flashcards") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Flashcard Mode</Text>
        <Text style={styles.progress}>
          Card {cardIndex + 1} of {flashcards.length}
        </Text>

        <Image
          source={{ uri: flashcards[cardIndex].image }}
          style={styles.image}
        />

        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowAnswer(!showAnswer)}
        >
          <Text style={styles.cardText}>
            {showAnswer
              ? flashcards[cardIndex].answer
              : flashcards[cardIndex].question}
          </Text>
        </TouchableOpacity>

        <Text style={styles.instructions}>
          Tap the card to reveal the answer.
        </Text>

        <TouchableOpacity style={styles.mainButton} onPress={nextCard}>
          <Text style={styles.buttonText}>Next Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={goToMenu}>
          <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === "quiz") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Mode</Text>
        <Text style={styles.progress}>
          Question {quizIndex + 1} of {flashcards.length}
        </Text>
        <Text style={styles.progress}>Current Score: {score}</Text>

        <Image
          source={{ uri: flashcards[quizIndex].image }}
          style={styles.image}
        />

        <View style={styles.card}>
          <Text style={styles.cardText}>{flashcards[quizIndex].question}</Text>
        </View>

        {flashcards[quizIndex].choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={styles.choiceButton}
            onPress={() => checkAnswer(choice)}
          >
            <Text style={styles.buttonText}>{choice}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.feedback}>{feedback}</Text>

        <TouchableOpacity style={styles.mainButton} onPress={nextQuestion}>
          <Text style={styles.buttonText}>Next Question</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={goToMenu}>
          <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === "edit") {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Edit Questions</Text>
        <Text style={styles.subtitle}>
          Replace the built-in questions and answers below.
        </Text>

        {editCards.map((card, index) => (
          <View key={index} style={styles.editorBox}>
            <Text style={styles.editorLabel}>Question {index + 1}</Text>
            <TextInput
              style={styles.input}
              value={card.question}
              onChangeText={(text) => updateEditQuestion(index, text)}
              placeholder="Enter a question"
            />

            <Text style={styles.editorLabel}>Answer {index + 1}</Text>
            <TextInput
              style={styles.input}
              value={card.answer}
              onChangeText={(text) => updateEditAnswer(index, text)}
              placeholder="Enter an answer"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.mainButton} onPress={saveEditedCards}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={goToMenu}>
          <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (screen === "results") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Results</Text>
        <Text style={styles.scoreText}>
          You scored {score} out of {flashcards.length}
        </Text>

        <Text style={styles.subtitle}>
          {score === flashcards.length
            ? "Excellent work!"
            : score >= 2
            ? "Nice job! You know this material well."
            : "Keep practicing and try again."}
        </Text>

        <TouchableOpacity style={styles.mainButton} onPress={startQuiz}>
          <Text style={styles.buttonText}>Retake Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={goToMenu}>
          <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: "#f2f6ff",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 25,
    color: "#333",
  },
  progress: {
    fontSize: 16,
    marginBottom: 10,
    color: "#444",
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  card: {
    width: 310,
    minHeight: 150,
    backgroundColor: "white",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardText: {
    fontSize: 22,
    textAlign: "center",
  },
  instructions: {
    fontSize: 16,
    marginBottom: 15,
    color: "#555",
    textAlign: "center",
  },
  mainButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
    minWidth: 220,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#607D8B",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
    minWidth: 220,
    alignItems: "center",
  },
  choiceButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    minWidth: 240,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  feedback: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
    color: "#222",
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  editorBox: {
    width: 320,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  editorLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    width: "100%",
  },
});