import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "react-native-linear-gradient";

const allContents = ["유머", "동물", "음식", "여행", "운동", "음악", "게임", "뉴스", "패션"];

const PreferredContentScreen = () => {

    const handleSave = () => {
        // TODO: 선택한 값 저장 로직 추가 가능
        navigation.goBack(); // 이전 화면으로 돌아가기
    };

    const navigation = useNavigation();
    const [selected, setSelected] = useState<string[]>(["유머", "동물"]); // 기본 선택값 예시

    // 선택 추가/해제
    const toggleContent = (item: string) => {
        if (selected.includes(item)) {
            setSelected(selected.filter((c) => c !== item));
        } else {
            setSelected([...selected, item]);
        }
    };

    // 선택 제거 (X 버튼)
    const removeContent = (item: string) => {
        setSelected(selected.filter((c) => c !== item));
    };

    return (
        <View style={styles.container}>
            {/* 상단 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={28} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerTextBox}>
                    <Text style={styles.headerTitle}>선호 콘텐츠 유형</Text>
                    <Text style={styles.headerSubtitle}>좋아하는 콘텐츠를 선택해주세요</Text>
                </View>
            </View>
            <View style={styles.blank} />
            {/* 선택된 콘텐츠 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    선택된 콘텐츠 ({selected.length}개)
                </Text>
                <View style={styles.selectedList}>
                    {selected.length === 0 ? (
                        <Text style={{ color: "#777" }}>선택된 콘텐츠가 없습니다.</Text>
                    ) : (
                        selected.map((item, idx) => (
                            <View key={idx} style={styles.selectedItem}>
                                <Text style={styles.selectedText}>{item}</Text>
                                <TouchableOpacity onPress={() => removeContent(item)}>
                                    <Icon name="x" size={16} color="#c34cff" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </View>

            {/* 모든 콘텐츠 유형 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>모든 콘텐츠 유형</Text>
                <FlatList
                    data={allContents}
                    keyExtractor={(item) => item}
                    numColumns={3} // 3x3 그리드
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    renderItem={({ item }) => {
                        const isSelected = selected.includes(item);
                        return (
                            <TouchableOpacity
                                onPress={() => toggleContent(item)}
                                style={[
                                    styles.contentItem,
                                    isSelected && styles.contentItemSelected,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.contentText,
                                        isSelected && styles.contentTextSelected,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* 저장하기 버튼 */}
            <TouchableOpacity onPress={handleSave} style={styles.saveButtonWrapper}>
                <LinearGradient
                    colors={['#ff66b3', '#d966ff']} // 원하는 색상으로 조정
                    start={{ x: 0, y: 0 }}          // 시작점
                    end={{ x: 1, y: 1 }}            // 끝점 (대각선)
                    style={styles.saveButton}     // 기존 View 스타일 그대로 사용
                >
                    <Text style={styles.saveButtonText}>저장하기</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

export default PreferredContentScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fafaff", padding: 16 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTextBox: {
        marginLeft: 12,
    },
    headerTitle: { fontSize: 22, fontWeight: "bold", color: "#333" },
    headerSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },
    section: {
        marginBottom: 20,
        backgroundColor: '#ffffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0ebff',
        padding: 20,
    },
    sectionTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 18 },
    selectedList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    selectedItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f3dbff",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 30,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedText: { marginRight: 4, fontSize: 14, color: "#c34cff", },
    contentItem: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: "#f1f3f5",
        marginHorizontal: 4,
    },
    contentItemSelected: {
        backgroundColor: "#f3dbff",
    },
    contentText: { fontSize: 14, color: "#333" },
    contentTextSelected: { color: "#c34cff", fontWeight: "600" },
    saveButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: "auto",
        marginBottom: 30,
    },
    saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    saveButtonWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
    blank: {
        height: 16,
    },
});