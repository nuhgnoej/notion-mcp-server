import { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { View, Text } from '@/components/Themed';
import { API_BASE_URL } from '@/constants/api';

export default function IndexScreen() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('입력 오류', '메시지를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/create-note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '프론트에서 보낸 메시지',
          content: message,
        }),
      });

      const data = await res.json();
      Alert.alert('서버 응답', data.message || '완료');
    } catch (err: any) {
      Alert.alert('에러', err.message || '요청 실패');
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>노트 메시지 전송</Text>

      <TextInput
        style={styles.input}
        placeholder="메시지를 입력하세요"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Button title={loading ? '전송 중...' : 'Submit'} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
});
