import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📘 MCP 노트 앱</Text>

      <Text style={styles.description}>
        이 앱은 OpenAI와 Notion을 연동하여
        {"\n"}자연어로 노트를 생성하고 기록할 수 있도록 도와줍니다.
        {"\n\n"}사용자는 간단한 프롬프트만 입력하면
        {"\n"}AI가 노트를 자동으로 작성해주며,
        {"\n"}원하는 경우 내용을 수정한 뒤 MCP 서버를 통해
        {"\n"}Notion에 바로 저장할 수 있습니다.
      </Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Text style={styles.footer}>🚀 개발자: odineyes Kim</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
  },
  separator: {
    height: 1,
    width: "80%",
    marginVertical: 16,
  },
  footer: {
    fontSize: 14,
    color: "#888",
  },
});
