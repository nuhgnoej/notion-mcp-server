import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_BASE_URL } from "@/constants/api";

const models = ["gpt-4.1", "o3-mini", "o1", "o1-pro"];

export default function SmartNoteScreen() {
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔧 선택 옵션 상태
  const [selectedModel, setSelectedModel] = useState("gpt-4.1");
  const [selectedDestination, setSelectedDestination] = useState("notion");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert("프롬프트 없음", "프롬프트를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/generate-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: selectedModel, // LLM 종류 추가
        }),
      });

      const data = await res.json();
      setGenerated(data.content || "생성 실패");
      console.log(JSON.stringify(data));
    } catch (err: any) {
      Alert.alert("에러", err.message || "OpenAI 요청 실패");
      console.log(API_BASE_URL)
      console.log("에러", err.message || "OpenAI 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!generated.trim()) {
      Alert.alert("내용 없음", "생성된 노트가 없습니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/create-note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "AI가 생성한 노트",
          content: generated,
          destination: selectedDestination, // 전송처 지정
        }),
      });

      const data = await res.json();
      console.log("data응답 내용:", data);
      Alert.alert("서버 응답", data.message || "전송 완료");
    } catch (err: any) {
      Alert.alert("에러", err.message || "MCP 전송 실패");
      console.log("err응답 내용:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI 노트 생성기</Text>

      <Text style={styles.label}>사용할 AI 모델</Text>
      <Picker
        selectedValue={selectedModel}
        onValueChange={(itemValue) => setSelectedModel(itemValue)}
        style={styles.picker}
      >
        {models.map((model) => (
          <Picker.Item key={model} label={model} value={model} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        value={prompt}
        onChangeText={setPrompt}
        placeholder="프롬프트를 입력하세요"
        multiline
      />

      <Button title="Generate" onPress={handleGenerate} disabled={loading} />

      <Text style={styles.subtitle}>AI가 생성한 내용</Text>
      <TextInput
        style={styles.generated}
        value={generated}
        onChangeText={setGenerated}
        multiline
        scrollEnabled
      />

      <Text style={styles.label}>전송할 앱</Text>
      <Picker
        selectedValue={selectedDestination}
        onValueChange={(itemValue) => setSelectedDestination(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Notion" value="notion" />
        {/* 확장 예정: Obsidian, Google Docs 등 */}
      </Picker>

      <Button
        title="Send to MCP Server"
        onPress={handleSend}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { marginTop: 20, fontSize: 16, fontWeight: "600" },
  label: { marginTop: 16, fontSize: 14, fontWeight: "500" },
  picker: {
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    minHeight: 80,
    backgroundColor: "#fff",
  },
  generated: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    minHeight: 180,
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
  },
});
