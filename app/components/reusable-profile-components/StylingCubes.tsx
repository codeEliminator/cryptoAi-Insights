import React from "react";
import { View } from "react-native";

export default function StylingCubes({cubeLength, left, top}: {cubeLength: number, left: number, top: number}) {
  return (
    <View style={{ flexDirection: 'column' }}>
      {Array.from({ length: cubeLength }).map((_, row) => (
        <View key={row} style={{ flexDirection: 'row' }}>
          {Array.from({ length: cubeLength }).map((_, col) => (
            <View
              key={col}
              style={{
                backgroundColor: '#dfdfdf',
                width: 5,
                height: 5,
                borderRadius: 5,
                margin: 5,
                position: 'absolute',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
