import { StyleSheet } from "react-native";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(5),
  },
  headerContainer: {
    marginTop: hp(8),
    marginBottom: hp(4),
    paddingHorizontal: wp(2),
  },
  title: {
    fontSize: hp(3.5),
    fontWeight: "bold",
    color: theme.colors.textDark,
    textAlign: "left",
  },
  subtitle: {
    fontSize: hp(1.8),
    color: theme.colors.textLight,
    textAlign: "left",
    marginTop: hp(1),
  },
  formContainer: {
    marginTop: hp(2),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.xxl,
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
    minHeight: hp(6),
  },
  input: {
    flex: 1,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2),
    fontSize: hp(1.8),
    color: theme.colors.textDark,
    minWidth: 0,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: hp(2),
    borderRadius: theme.radius.xxl,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    padding: wp(5),
  },
  footerText: {
    color: theme.colors.textLight,
    fontSize: hp(1.8),
    textAlign: "center",
  },
  footerLink: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: hp(2),
    left: wp(4),
    zIndex: 1,
    padding: wp(2),
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: wp(4),
    paddingTop: hp(10),
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
    marginBottom: hp(5),
  },
  textContainer: {
    gap: hp(2),
    alignItems: "center",
    marginBottom: hp(5),
  },
  welcomeTitle: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: "800",
  },
  punchline: {
    color: theme.colors.text,
    fontSize: hp(1.7),
    textAlign: "center",
    paddingHorizontal: wp(10),
  },
  welcomeFooter: {
    width: "100%",
    position: "absolute",
    bottom: hp(5),
    paddingHorizontal: wp(4),
    gap: hp(2),
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(5),
  },
  userImage: {
    height: hp(30),
    width: wp(80),
    resizeMode: "contain",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: hp(4),
  },
  forgotPasswordText: {
    color: theme.colors.textLight,
    fontSize: hp(1.6),
  },
});
