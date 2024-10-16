# Code_Styler_For_Google_rules
Styles all consts' and functions' names according to "Google C++ Style Guide" rules of naming functions and constants
Can be used on C++ source and header files by clicking Ctrl+Alt+L (a. k. a. Clion auto formatting)
# Functionality
Carefully changes all consts' and functions' names from snake_case to PascalCase without touching const pointers (such as const char*, etc). Touches only code in selection in editor. If constant of function is defined outside selection, styler will skip it in order to avoid namespace conficts and losses of definition.
# Examples of usage
const int simple_integer_number = 52;
const std::string omg_it_Is_a_String = "Yes, it is. Never mind, 52";
const bool am_i_crazy = true;
const char just_a = 'a';
bool substract_b_From_a(int a, int b){return a-b;}

omg_it_Is_a_String;
substract_b_From_a(10, 1);

smth_declared_outside;
_____________________________________________________________________
// Your code was formated to follow the "Google C++ Style Guide" rules of naming functions and constants
const int kSimpleIntegerNumber = 52;
const std::string kOmgItIsAString = "Yes, it is. Never mind, 52";
const bool kAmICrazy = true;
const char kJustA = 'a';
bool SubstractBFromA(int a, int b){return a-b;}

kOmgItIsAString;
SubstractBFromA(10, 1);

smth_declared_outside;

# Shortcut
Ctrl+Alt+L (selection in editor needed)