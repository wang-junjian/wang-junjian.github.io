---
layout: single
title:  "SimulStreaming — 实时流式语音识别工具包"
date:   2025-11-19 08:00:00 +0800
categories: SimulStreaming ASR
tags: [SimulStreaming, ASR]
---

<!--more-->

SimulStreaming 实现了 Whisper 模型的同步翻译和转录功能（在语音识别领域被称为流式传输）。SimulStreaming 采用了最先进的同步策略 AlignAtt，这使其具备极高的速度和效率。

## 安装

```bash
git clone https://github.com/ufal/SimulStreaming
cd SimulStreaming
```

```bash
pip install -r requirements.txt
```

## 从音频文件进行实时模拟

```bash
python simulstreaming_whisper.py test.wav --language auto  --task transcribe --comp_unaware --model_path ~/.cache/whisper/small.pt
```
```bash
INFO	Audio duration is: 26.94 seconds
INFO	Arguments: {'model_path': '/Users/junjian/.cache/whisper/small.pt', 'cif_ckpt_path': None, 'frame_threshold': 25, 'audio_min_len': 0.0, 'audio_max_len': 30.0, 'beams': 1, 'task': 'transcribe', 'never_fire': False, 'init_prompt': None, 'static_init_prompt': None, 'max_context_tokens': None, 'logdir': None, 'language': 'auto', 'segment_length': 1.2, 'decoder_type': 'greedy'}
INFO	Language: auto
INFO	Model dimensions: ModelDimensions(n_mels=80, n_audio_ctx=1500, n_audio_state=768, n_audio_head=12, n_audio_layer=12, n_vocab=51865, n_text_ctx=448, n_text_state=768, n_text_head=12, n_text_layer=12)
DEBUG	Suppress tokens: (50258, 50259, 50260, 50261, 50262, 50263, 50264, 50265, 50266, 50267, 50268, 50269, 50270, 50271, 50272, 50273, 50274, 50275, 50276, 50277, 50278, 50279, 50280, 50281, 50282, 50283, 50284, 50285, 50286, 50287, 50288, 50289, 50290, 50291, 50292, 50293, 50294, 50295, 50296, 50297, 50298, 50299, 50300, 50301, 50302, 50303, 50304, 50305, 50306, 50307, 50308, 50309, 50310, 50311, 50312, 50313, 50314, 50315, 50316, 50317, 50318, 50319, 50320, 50321, 50322, 50323, 50324, 50325, 50326, 50327, 50328, 50329, 50330, 50331, 50332, 50333, 50334, 50335, 50336, 50337, 50338, 50339, 50340, 50341, 50342, 50343, 50344, 50345, 50346, 50347, 50348, 50349, 50350, 50351, 50352, 50353, 50354, 50355, 50356, 50357, 50358, 50359, 50360, 50361, 50362, 50363)
DEBUG	init tokens, 0
DEBUG	init tokens after, 0
INFO	Using greedy decoder
DEBUG	Refreshing segment:
DEBUG	init tokens, 0
DEBUG	init tokens after, 0
DEBUG	Context: <token_buffer.TokenBuffer object at 0x129e99590>
DEBUG	removing all segments.
DEBUG	Language tokens: tensor([50263]), probs: [{'nl': 0.007210352458059788, 'be': 0.00040213586180470884, 'ht': 0.00012452408554963768, 'kk': 0.0002982253208756447, 'cy': 0.0028812228702008724, 'id': 0.009381481446325779, 'fi': 0.010599683970212936, 'mg': 5.824487558925284e-09, 'sa': 0.00018837035167962313, 'ca': 0.0008897573570720851, 'ro': 0.00703317578881979, 'es': 0.012305445037782192, 'ne': 0.00029153565992601216, 'ja': 0.009292925707995892, 'la': 0.0030669725965708494, 'bs': 0.0024170042015612125, 'ru': 0.2966392934322357, 'gu': 1.2858286936534569e-05, 'pa': 0.0001350795937469229, 'hr': 0.0036529800854623318, 'ps': 5.1290557166794315e-05, 'ur': 0.0012869610218331218, 'te': 0.0012292735045775771, 'el': 0.0018588189268484712, 'tt': 1.7737563950959157e-07, 'pl': 0.021354932337999344, 'cs': 0.0064005134627223015, 'et': 0.00015833099314477295, 'am': 4.224672920827288e-06, 'jw': 0.005232068710029125, 'sk': 0.0031467480584979057, 'hy': 0.00011581285070860758, 'uz': 1.2067248533753627e-08, 'hi': 0.003915033768862486, 'ka': 4.3694850319297984e-05, 'th': 0.004048689268529415, 'sw': 0.0003148556570522487, 'mi': 0.0012211132561787963, 'bg': 0.002576627302914858, 'az': 0.00022346270270645618, 'ml': 0.0032441234216094017, 'uk': 0.013992970809340477, 'ms': 0.001456861151382327, 'ar': 0.0012433143565431237, 'ha': 1.1330468119297166e-08, 'km': 0.002829283243045211, 'he': 0.0003195946919731796, 'sn': 0.0006110823596827686, 'mn': 0.0003377569664735347, 'lt': 0.0013949301792308688, 'so': 3.071554601774551e-06, 'yo': 0.0002591414377093315, 'zh': 0.11119657009840012, 'de': 0.0066844867542386055, 'sq': 0.00017827693955041468, 'sv': 0.002400398487225175, 'fo': 7.672204083064571e-05, 'ta': 0.00995561107993126, 'tk': 3.978717089125894e-08, 'mr': 0.00011183982132934034, 'fr': 0.004338819999247789, 'sd': 6.280643719946966e-05, 'pt': 0.055570587515830994, 'nn': 0.017181161791086197, 'bo': 0.00020247693464625627, 'kn': 6.782354466849938e-05, 'lv': 0.0013210283359512687, 'tl': 0.0022483260836452246, 'vi': 0.009864607825875282, 'en': 0.20267584919929504, 'is': 0.00011378520866855979, 'ba': 4.231914729757591e-08, 'fa': 0.0006017914274707437, 'mk': 7.778047438478097e-05, 'my': 0.00016014327411539853, 'lb': 6.487818637879172e-08, 'hu': 0.0031927560921758413, 'tr': 0.0455496720969677, 'tg': 3.315020649097278e-07, 'ko': 0.061568666249513626, 'su': 1.2583780062414007e-07, 'no': 0.0037437828723341227, 'haw': 0.0006938993465155363, 'br': 7.0026027970016e-05, 'si': 0.0013997701462358236, 'yi': 4.306097616790794e-05, 'sl': 0.00038068697904236615, 'eu': 0.00016572607273701578, 'sr': 0.0006805910379625857, 'oc': 2.4442335416097194e-05, 'as': 2.5203602490364574e-05, 'da': 0.002299798419699073, 'gl': 0.00021693724556826055, 'mt': 1.9961614725616528e-06, 'bn': 0.0011825325200334191, 'it': 0.007812639698386192, 'af': 0.00010924239904852584, 'ln': 3.904955974576296e-06, 'lo': 4.5279604819370434e-05}]
INFO	Detected language: ru with p=0.2966
DEBUG	init tokens, 1
DEBUG	init tokens after, 1
INFO	Tokenizer language: ru, (50258, 50263, 50359, 50363)
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 4)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|ru|><|transcribe|><|notimestamps|>
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-2.494642734527588], tokens:
DEBUG	<|startoftranscript|><|ru|><|transcribe|><|notimestamps|> К
DEBUG	[39] most att frames
DEBUG	current tokenstorch.Size([1, 5])
DEBUG	attn: torch.Size([1, 4, 50]), current pos: 39, current token: 3422( К)
DEBUG	Decoding completed: False, sum_logprobs: [-2.9047510623931885], tokens:
DEBUG	<|startoftranscript|><|ru|><|transcribe|><|notimestamps|> Клад
DEBUG	[49] most att frames
DEBUG	current tokenstorch.Size([1, 6])
DEBUG	attention reaches the end: 49/50
INFO	End of decoding loop
DEBUG	new_hypothesis: [3422]
INFO	Output:  К
DEBUG	Refreshing segment:
DEBUG	init tokens, 1
DEBUG	init tokens after, 1
DEBUG	Context: <token_buffer.TokenBuffer object at 0x129dbe710>
DEBUG	removing all segments.
DEBUG	Language tokens: tensor([50260]), probs: [{'nl': 0.0001188502210425213, 'be': 8.828455065668095e-06, 'ht': 1.7139771443908103e-05, 'kk': 3.3007240745064337e-06, 'cy': 0.0003593256988096982, 'id': 0.001095119398087263, 'fi': 0.00020141607092227787, 'mg': 2.7317886841515815e-10, 'sa': 8.489898027619347e-05, 'ca': 4.20229707742692e-06, 'ro': 0.00015815556980669498, 'es': 0.0008569261990487576, 'ne': 8.00056877778843e-05, 'ja': 0.0018787162844091654, 'la': 0.00037668002187274396, 'bs': 1.937022534548305e-05, 'ru': 0.0037228111177682877, 'gu': 1.4649823469881085e-06, 'pa': 1.6393971236539073e-05, 'hr': 1.9927074390579946e-05, 'ps': 1.5302422298191232e-06, 'ur': 0.001394361723214388, 'te': 0.0002902903943322599, 'el': 1.693511330813635e-05, 'tt': 6.497747895295447e-10, 'pl': 0.0007997140055522323, 'cs': 0.0002087641623802483, 'et': 2.089366262225667e-06, 'am': 2.2049268011414824e-07, 'jw': 0.0023091156035661697, 'sk': 2.4021859644562937e-05, 'hy': 6.89574153511785e-06, 'uz': 4.308796097696188e-10, 'hi': 0.0036358057986944914, 'ka': 2.0054309857187036e-07, 'th': 0.06219157949090004, 'sw': 1.964507464435883e-05, 'mi': 5.537637844099663e-05, 'bg': 5.486586815095507e-06, 'az': 7.4312492870376445e-06, 'ml': 0.001070418395102024, 'uk': 0.00010978282080031931, 'ms': 0.0005198144353926182, 'ar': 0.000319199200021103, 'ha': 1.0264457062092447e-09, 'km': 0.0017440662486478686, 'he': 3.722020892382716e-06, 'sn': 0.00019705166050698608, 'mn': 5.4791904403828084e-05, 'lt': 5.227076144365128e-06, 'so': 1.8558812087121623e-07, 'yo': 3.5335178836248815e-05, 'zh': 0.7891337275505066, 'de': 0.0034965570084750652, 'sq': 1.037934794112516e-06, 'sv': 0.00045752531150355935, 'fo': 7.399235983029939e-06, 'ta': 0.0005079589318484068, 'tk': 2.5255100233323446e-09, 'mr': 4.359404101705877e-06, 'fr': 0.0002899901883210987, 'sd': 2.1110567104187794e-05, 'pt': 0.001813002279959619, 'nn': 0.0053854952566325665, 'bo': 0.00012003349547740072, 'kn': 1.4450426988332765e-06, 'lv': 4.376420292828698e-06, 'tl': 0.0003097167646046728, 'vi': 0.027634743601083755, 'en': 0.035021454095840454, 'is': 2.725782906054519e-06, 'ba': 1.5768978345320761e-09, 'fa': 0.00014479369565378875, 'mk': 2.825463525368832e-07, 'my': 0.0005612847744487226, 'lb': 1.8579973115606663e-09, 'hu': 0.00029588124016299844, 'tr': 0.005889244377613068, 'tg': 6.898624782536444e-09, 'ko': 0.041574250906705856, 'su': 4.603098346933621e-09, 'no': 0.0001233737712027505, 'haw': 0.0004675053933169693, 'br': 3.1749008485348895e-05, 'si': 0.000689161301124841, 'yi': 1.9051041135753621e-06, 'sl': 9.214040801452938e-06, 'eu': 1.2509125554061029e-05, 'sr': 9.033739843289368e-06, 'oc': 1.779346007424465e-06, 'as': 1.8988743249792606e-05, 'da': 0.000327571586240083, 'gl': 2.5453546186327003e-05, 'mt': 8.50198205171182e-08, 'bn': 0.000357939163222909, 'it': 0.0010736316908150911, 'af': 1.382967752761033e-06, 'ln': 2.2388675802176294e-07, 'lo': 0.0001178194215754047}]
INFO	Detected language: zh with p=0.7891
DEBUG	init tokens, 1
DEBUG	init tokens after, 1
INFO	Tokenizer language: zh, (50258, 50260, 50359, 50363)
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 4)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.7416945099830627], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格
DEBUG	[39] most att frames
DEBUG	current tokenstorch.Size([1, 5])
DEBUG	attention reaches the end: 39/60
INFO	End of decoding loop
DEBUG	new_hypothesis: []
INFO	Output:
DEBUG	No text in this segment
INFO	## last processed 1.20s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 4)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.24130553007125854], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格
DEBUG	[41] most att frames
DEBUG	current tokenstorch.Size([1, 5])
DEBUG	attn: torch.Size([1, 4, 120]), current pos: 41, current token: 30921(格)
DEBUG	Decoding completed: False, sum_logprobs: [-0.31948941946029663], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格�
DEBUG	[56] most att frames
DEBUG	current tokenstorch.Size([1, 6])
DEBUG	attn: torch.Size([1, 5, 120]), current pos: 56, current token: 2347(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.3201572597026825], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰
DEBUG	[57] most att frames
DEBUG	current tokenstorch.Size([1, 7])
DEBUG	attn: torch.Size([1, 6, 120]), current pos: 57, current token: 108(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.43460726737976074], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发
DEBUG	[69] most att frames
DEBUG	current tokenstorch.Size([1, 8])
DEBUG	attn: torch.Size([1, 7, 120]), current pos: 69, current token: 28926(发)
DEBUG	Decoding completed: False, sum_logprobs: [-0.442035436630249], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布
DEBUG	[84] most att frames
DEBUG	current tokenstorch.Size([1, 9])
DEBUG	attn: torch.Size([1, 8, 120]), current pos: 84, current token: 34688(布)
DEBUG	Decoding completed: False, sum_logprobs: [-0.4606987237930298], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了
DEBUG	[95] most att frames
DEBUG	current tokenstorch.Size([1, 10])
DEBUG	attention reaches the end: 95/120
INFO	End of decoding loop
DEBUG	new_hypothesis: [30921, 2347, 108, 28926, 34688]
INFO	Output: 格兰发布
DEBUG	TS-WORD-INFO: {'start': 0.8200000000000001, 'end': 0.8200000000000001, 'text': '格', 'tokens': [30921]}
DEBUG	TS-WORD-INFO: {'start': 1.12, 'end': 1.1400000000000001, 'text': '兰', 'tokens': [2347, 108]}
DEBUG	TS-WORD-INFO: {'start': 1.3800000000000001, 'end': 1.3800000000000001, 'text': '发', 'tokens': [28926]}
DEBUG	TS-WORD-INFO: {'start': 1.68, 'end': 1.68, 'text': '布', 'tokens': [34688]}
DEBUG	2400.0000 820 1680 格兰发布
2400.0000 820 1680 格兰发布
INFO	## last processed 2.40s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 9)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.01437357533723116], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了
DEBUG	[98] most att frames
DEBUG	current tokenstorch.Size([1, 10])
DEBUG	attn: torch.Size([1, 9, 179]), current pos: 98, current token: 2289(了)
DEBUG	Decoding completed: False, sum_logprobs: [-0.06788095831871033], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一
DEBUG	[111] most att frames
DEBUG	current tokenstorch.Size([1, 11])
DEBUG	attn: torch.Size([1, 10, 179]), current pos: 111, current token: 2257(一)
DEBUG	Decoding completed: False, sum_logprobs: [-0.07025255262851715], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份
DEBUG	[127] most att frames
DEBUG	current tokenstorch.Size([1, 12])
DEBUG	attn: torch.Size([1, 11, 179]), current pos: 127, current token: 36266(份)
DEBUG	Decoding completed: False, sum_logprobs: [-0.07450807839632034], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主
DEBUG	[149] most att frames
DEBUG	current tokenstorch.Size([1, 13])
DEBUG	attn: torch.Size([1, 12, 179]), current pos: 149, current token: 13557(主)
DEBUG	Decoding completed: False, sum_logprobs: [-0.21367615461349487], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题
DEBUG	[160] most att frames
DEBUG	current tokenstorch.Size([1, 14])
DEBUG	attention reaches the end: 160/179
INFO	End of decoding loop
DEBUG	new_hypothesis: [2289, 2257, 36266, 13557]
INFO	Output: 了一份主
DEBUG	TS-WORD-INFO: {'start': 1.96, 'end': 1.96, 'text': '了', 'tokens': [2289]}
DEBUG	TS-WORD-INFO: {'start': 2.22, 'end': 2.22, 'text': '一', 'tokens': [2257]}
DEBUG	TS-WORD-INFO: {'start': 2.54, 'end': 2.54, 'text': '份', 'tokens': [36266]}
DEBUG	TS-WORD-INFO: {'start': 2.98, 'end': 2.98, 'text': '主', 'tokens': [13557]}
DEBUG	3600.0000 1960 2980 了一份主
3600.0000 1960 2980 了一份主
INFO	## last processed 3.60s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 13)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.03644866123795509], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题
DEBUG	[159] most att frames
DEBUG	current tokenstorch.Size([1, 14])
DEBUG	attn: torch.Size([1, 13, 240]), current pos: 159, current token: 30716(题)
DEBUG	Decoding completed: False, sum_logprobs: [-1.0204583406448364], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为
DEBUG	[171] most att frames
DEBUG	current tokenstorch.Size([1, 15])
DEBUG	attn: torch.Size([1, 14, 240]), current pos: 171, current token: 13992(为)
DEBUG	Decoding completed: False, sum_logprobs: [-1.6101253032684326], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为�
DEBUG	[213] most att frames
DEBUG	current tokenstorch.Size([1, 16])
DEBUG	attn: torch.Size([1, 15, 240]), current pos: 213, current token: 2415(�)
DEBUG	Decoding completed: False, sum_logprobs: [-1.61183500289917], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣
DEBUG	[220] most att frames
DEBUG	current tokenstorch.Size([1, 17])
DEBUG	attention reaches the end: 220/240
INFO	End of decoding loop
DEBUG	new_hypothesis: [30716, 13992, 2415]
INFO	Output: 题为�
DEBUG	Hiding incomplete unicode character: [2415]
DEBUG	TS-WORD-INFO: {'start': 3.18, 'end': 3.18, 'text': '题', 'tokens': [30716]}
DEBUG	TS-WORD-INFO: {'start': 3.18, 'end': 3.18, 'text': '为', 'tokens': [13992]}
DEBUG	4800.0000 3180 3181 题为
4800.0000 3180 3181 题为
INFO	## last processed 4.80s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 16)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为�
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.0019368238281458616], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣
DEBUG	[220] most att frames
DEBUG	current tokenstorch.Size([1, 17])
DEBUG	attn: torch.Size([1, 16, 300]), current pos: 220, current token: 96(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.01276619266718626], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布
DEBUG	[228] most att frames
DEBUG	current tokenstorch.Size([1, 18])
DEBUG	attn: torch.Size([1, 17, 300]), current pos: 228, current token: 34688(布)
DEBUG	Decoding completed: False, sum_logprobs: [-0.05026660114526749], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即
DEBUG	[245] most att frames
DEBUG	current tokenstorch.Size([1, 19])
DEBUG	attn: torch.Size([1, 18, 300]), current pos: 245, current token: 39127(即)
DEBUG	Decoding completed: False, sum_logprobs: [-0.056277982890605927], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将
DEBUG	[265] most att frames
DEBUG	current tokenstorch.Size([1, 20])
DEBUG	attn: torch.Size([1, 19, 300]), current pos: 265, current token: 45456(将)
DEBUG	Decoding completed: False, sum_logprobs: [-0.13618922233581543], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对
DEBUG	[288] most att frames
DEBUG	current tokenstorch.Size([1, 21])
DEBUG	attention reaches the end: 288/300
INFO	End of decoding loop
DEBUG	new_hypothesis: [96, 34688, 39127, 45456]
INFO	Output: �布即将
DEBUG	Hiding incomplete unicode character: [2415]
DEBUG	TS-WORD-INFO: {'start': 4.4, 'end': 4.5600000000000005, 'text': '宣', 'tokens': [2415, 96]}
DEBUG	TS-WORD-INFO: {'start': 4.9, 'end': 4.9, 'text': '布', 'tokens': [34688]}
DEBUG	TS-WORD-INFO: {'start': 5.3, 'end': 5.3, 'text': '即', 'tokens': [39127]}
DEBUG	TS-WORD-INFO: {'start': 5.76, 'end': 5.76, 'text': '将', 'tokens': [45456]}
DEBUG	6000.0000 4400 5760 宣布即将
6000.0000 4400 5760 宣布即将
INFO	## last processed 6.00s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 20)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.02412545680999756], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对
DEBUG	[288] most att frames
DEBUG	current tokenstorch.Size([1, 21])
DEBUG	attn: torch.Size([1, 20, 360]), current pos: 288, current token: 8713(对)
DEBUG	Decoding completed: False, sum_logprobs: [-0.061126839369535446], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先
DEBUG	[312] most att frames
DEBUG	current tokenstorch.Size([1, 22])
DEBUG	attn: torch.Size([1, 21, 360]), current pos: 312, current token: 10108(先)
DEBUG	Decoding completed: False, sum_logprobs: [-0.2043335735797882], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进
DEBUG	[325] most att frames
DEBUG	current tokenstorch.Size([1, 23])
DEBUG	attn: torch.Size([1, 22, 360]), current pos: 325, current token: 36700(进)
DEBUG	Decoding completed: False, sum_logprobs: [-0.4732191562652588], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半
DEBUG	[341] most att frames
DEBUG	current tokenstorch.Size([1, 24])
DEBUG	attention reaches the end: 341/360
INFO	End of decoding loop
DEBUG	new_hypothesis: [8713, 10108, 36700]
INFO	Output: 对先进
DEBUG	TS-WORD-INFO: {'start': 5.76, 'end': 5.76, 'text': '对', 'tokens': [8713]}
DEBUG	TS-WORD-INFO: {'start': 6.24, 'end': 6.24, 'text': '先', 'tokens': [10108]}
DEBUG	TS-WORD-INFO: {'start': 6.5, 'end': 6.5, 'text': '进', 'tokens': [36700]}
DEBUG	7200.0000 5761 6500 对先进
7200.0000 5761 6500 对先进
INFO	## last processed 7.20s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 23)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.0584028996527195], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半
DEBUG	[341] most att frames
DEBUG	current tokenstorch.Size([1, 24])
DEBUG	attn: torch.Size([1, 23, 420]), current pos: 341, current token: 30018(半)
DEBUG	Decoding completed: False, sum_logprobs: [-0.10378111153841019], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半�
DEBUG	[353] most att frames
DEBUG	current tokenstorch.Size([1, 25])
DEBUG	attn: torch.Size([1, 24, 420]), current pos: 353, current token: 4510(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.10409601032733917], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导
DEBUG	[360] most att frames
DEBUG	current tokenstorch.Size([1, 26])
DEBUG	attn: torch.Size([1, 25, 420]), current pos: 360, current token: 120(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.11387187242507935], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体
DEBUG	[360] most att frames
DEBUG	current tokenstorch.Size([1, 27])
DEBUG	attn: torch.Size([1, 26, 420]), current pos: 360, current token: 29485(体)
DEBUG	Decoding completed: False, sum_logprobs: [-1.0010790824890137], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道
DEBUG	[374] most att frames
DEBUG	current tokenstorch.Size([1, 28])
DEBUG	attn: torch.Size([1, 27, 420]), current pos: 374, current token: 7758(知道)
DEBUG	Decoding completed: False, sum_logprobs: [-1.0562164783477783], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道�
DEBUG	[396] most att frames
DEBUG	current tokenstorch.Size([1, 29])
DEBUG	attention reaches the end: 396/420
INFO	End of decoding loop
DEBUG	new_hypothesis: [30018, 4510, 120, 29485, 7758]
INFO	Output: 半导体知道
DEBUG	TS-WORD-INFO: {'start': 6.82, 'end': 6.82, 'text': '半', 'tokens': [30018]}
DEBUG	TS-WORD-INFO: {'start': 7.0600000000000005, 'end': 7.2, 'text': '导', 'tokens': [4510, 120]}
DEBUG	TS-WORD-INFO: {'start': 7.2, 'end': 7.2, 'text': '体', 'tokens': [29485]}
DEBUG	TS-WORD-INFO: {'start': 7.48, 'end': 7.48, 'text': '知道', 'tokens': [7758]}
DEBUG	8400.0000 6820 7480 半导体知道
8400.0000 6820 7480 半导体知道
INFO	## last processed 8.40s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 28)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.036658525466918945], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道�
DEBUG	[396] most att frames
DEBUG	current tokenstorch.Size([1, 29])
DEBUG	attn: torch.Size([1, 28, 480]), current pos: 396, current token: 7422(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.03681289032101631], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设
DEBUG	[406] most att frames
DEBUG	current tokenstorch.Size([1, 30])
DEBUG	attn: torch.Size([1, 29, 480]), current pos: 406, current token: 122(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.03754301741719246], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设�
DEBUG	[413] most att frames
DEBUG	current tokenstorch.Size([1, 31])
DEBUG	attn: torch.Size([1, 30, 480]), current pos: 413, current token: 1787(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.03759761527180672], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备
DEBUG	[419] most att frames
DEBUG	current tokenstorch.Size([1, 32])
DEBUG	attn: torch.Size([1, 31, 480]), current pos: 419, current token: 229(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.922974705696106], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备�
DEBUG	[423] most att frames
DEBUG	current tokenstorch.Size([1, 33])
DEBUG	attn: torch.Size([1, 32, 480]), current pos: 423, current token: 7235(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.9278853535652161], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬
DEBUG	[438] most att frames
DEBUG	current tokenstorch.Size([1, 34])
DEBUG	attn: torch.Size([1, 33, 480]), current pos: 438, current token: 105(�)
DEBUG	Decoding completed: False, sum_logprobs: [-1.2143722772598267], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取
DEBUG	[444] most att frames
DEBUG	current tokenstorch.Size([1, 35])
DEBUG	attn: torch.Size([1, 34, 480]), current pos: 444, current token: 29436(取)
DEBUG	Decoding completed: False, sum_logprobs: [-1.3233751058578491], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的
DEBUG	[458] most att frames
DEBUG	current tokenstorch.Size([1, 36])
DEBUG	attention reaches the end: 458/480
INFO	End of decoding loop
DEBUG	new_hypothesis: [7422, 122, 1787, 229, 7235, 105, 29436]
INFO	Output: 设备抬取
DEBUG	TS-WORD-INFO: {'start': 7.92, 'end': 8.120000000000001, 'text': '设', 'tokens': [7422, 122]}
DEBUG	TS-WORD-INFO: {'start': 8.26, 'end': 8.38, 'text': '备', 'tokens': [1787, 229]}
DEBUG	TS-WORD-INFO: {'start': 8.46, 'end': 8.76, 'text': '抬', 'tokens': [7235, 105]}
DEBUG	TS-WORD-INFO: {'start': 8.88, 'end': 8.88, 'text': '取', 'tokens': [29436]}
DEBUG	9600.0000 7920 8880 设备抬取
9600.0000 7920 8880 设备抬取
INFO	## last processed 9.60s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 35)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.046373382210731506], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的
DEBUG	[460] most att frames
DEBUG	current tokenstorch.Size([1, 36])
DEBUG	attn: torch.Size([1, 35, 539]), current pos: 460, current token: 1546(的)
DEBUG	Decoding completed: False, sum_logprobs: [-0.0734555572271347], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出
DEBUG	[494] most att frames
DEBUG	current tokenstorch.Size([1, 37])
DEBUG	attn: torch.Size([1, 36, 539]), current pos: 494, current token: 7781(出)
DEBUG	Decoding completed: False, sum_logprobs: [-0.079010508954525], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口
DEBUG	[500] most att frames
DEBUG	current tokenstorch.Size([1, 38])
DEBUG	attn: torch.Size([1, 37, 539]), current pos: 500, current token: 18144(口)
DEBUG	Decoding completed: False, sum_logprobs: [-0.09206806868314743], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管
DEBUG	[510] most att frames
DEBUG	current tokenstorch.Size([1, 39])
DEBUG	attn: torch.Size([1, 38, 539]), current pos: 510, current token: 23131(管)
DEBUG	Decoding completed: False, sum_logprobs: [-0.10278952866792679], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制
DEBUG	[524] most att frames
DEBUG	current tokenstorch.Size([1, 40])
DEBUG	attention reaches the end: 524/539
INFO	End of decoding loop
DEBUG	new_hypothesis: [1546, 7781, 18144, 23131]
INFO	Output: 的出口管
DEBUG	TS-WORD-INFO: {'start': 9.200000000000001, 'end': 9.200000000000001, 'text': '的', 'tokens': [1546]}
DEBUG	TS-WORD-INFO: {'start': 9.88, 'end': 9.88, 'text': '出', 'tokens': [7781]}
DEBUG	TS-WORD-INFO: {'start': 10.0, 'end': 10.0, 'text': '口', 'tokens': [18144]}
DEBUG	TS-WORD-INFO: {'start': 10.200000000000001, 'end': 10.200000000000001, 'text': '管', 'tokens': [23131]}
DEBUG	10800.0000 9200 10200 的出口管
10800.0000 9200 10200 的出口管
INFO	## last processed 10.80s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 39)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.002577199600636959], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制
DEBUG	[524] most att frames
DEBUG	current tokenstorch.Size([1, 40])
DEBUG	attn: torch.Size([1, 39, 599]), current pos: 524, current token: 25491(制)
DEBUG	Decoding completed: False, sum_logprobs: [-0.04998182877898216], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制�
DEBUG	[533] most att frames
DEBUG	current tokenstorch.Size([1, 41])
DEBUG	attn: torch.Size([1, 40, 599]), current pos: 533, current token: 6900(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.05259315297007561], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措
DEBUG	[537] most att frames
DEBUG	current tokenstorch.Size([1, 42])
DEBUG	attn: torch.Size([1, 41, 599]), current pos: 537, current token: 103(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.2784411907196045], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措�
DEBUG	[543] most att frames
DEBUG	current tokenstorch.Size([1, 43])
DEBUG	attn: torch.Size([1, 42, 599]), current pos: 543, current token: 4307(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.3356192409992218], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施
DEBUG	[553] most att frames
DEBUG	current tokenstorch.Size([1, 44])
DEBUG	attn: torch.Size([1, 43, 599]), current pos: 553, current token: 121(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.3862385153770447], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的
DEBUG	[580] most att frames
DEBUG	current tokenstorch.Size([1, 45])
DEBUG	attention reaches the end: 580/599
INFO	End of decoding loop
DEBUG	new_hypothesis: [25491, 6900, 103, 4307, 121]
INFO	Output: 制措施
DEBUG	TS-WORD-INFO: {'start': 10.48, 'end': 10.48, 'text': '制', 'tokens': [25491]}
DEBUG	TS-WORD-INFO: {'start': 10.66, 'end': 10.74, 'text': '措', 'tokens': [6900, 103]}
DEBUG	TS-WORD-INFO: {'start': 10.86, 'end': 11.06, 'text': '施', 'tokens': [4307, 121]}
DEBUG	12000.0000 10480 11060 制措施
12000.0000 10480 11060 制措施
INFO	## last processed 12.00s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 44)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.05831170082092285], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的
DEBUG	[578] most att frames
DEBUG	current tokenstorch.Size([1, 45])
DEBUG	attn: torch.Size([1, 44, 659]), current pos: 578, current token: 1546(的)
DEBUG	Decoding completed: False, sum_logprobs: [-0.07156068086624146], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公
DEBUG	[587] most att frames
DEBUG	current tokenstorch.Size([1, 46])
DEBUG	attn: torch.Size([1, 45, 659]), current pos: 587, current token: 13545(公)
DEBUG	Decoding completed: False, sum_logprobs: [-0.07279718667268753], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告
DEBUG	[598] most att frames
DEBUG	current tokenstorch.Size([1, 47])
DEBUG	attn: torch.Size([1, 46, 659]), current pos: 598, current token: 16846(告)
DEBUG	Decoding completed: False, sum_logprobs: [-0.1214665025472641], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示
DEBUG	[607] most att frames
DEBUG	current tokenstorch.Size([1, 48])
DEBUG	attn: torch.Size([1, 47, 659]), current pos: 607, current token: 40053(表示)
DEBUG	Decoding completed: True, sum_logprobs: [-1.1428920030593872], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示<|endoftext|>
DEBUG	[658] most att frames
DEBUG	current tokenstorch.Size([1, 49])
INFO	End of decoding loop
DEBUG	new_hypothesis: [1546, 13545, 16846, 40053]
INFO	Output: 的公告表示
DEBUG	TS-WORD-INFO: {'start': 11.56, 'end': 11.56, 'text': '的', 'tokens': [1546]}
DEBUG	TS-WORD-INFO: {'start': 11.74, 'end': 11.74, 'text': '公', 'tokens': [13545]}
DEBUG	TS-WORD-INFO: {'start': 11.96, 'end': 11.96, 'text': '告', 'tokens': [16846]}
DEBUG	TS-WORD-INFO: {'start': 12.14, 'end': 12.14, 'text': '表示', 'tokens': [40053]}
DEBUG	13200.0000 11560 12140 的公告表示
13200.0000 11560 12140 的公告表示
INFO	## last processed 13.20s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 48)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.2920331656932831], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,
DEBUG	[664] most att frames
DEBUG	current tokenstorch.Size([1, 49])
DEBUG	attn: torch.Size([1, 48, 719]), current pos: 664, current token: 11(,)
DEBUG	Decoding completed: False, sum_logprobs: [-1.3168038129806519], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,�
DEBUG	[669] most att frames
DEBUG	current tokenstorch.Size([1, 50])
DEBUG	attn: torch.Size([1, 49, 719]), current pos: 669, current token: 5419(�)
DEBUG	Decoding completed: False, sum_logprobs: [-1.322206974029541], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监
DEBUG	[675] most att frames
DEBUG	current tokenstorch.Size([1, 51])
DEBUG	attn: torch.Size([1, 50, 719]), current pos: 675, current token: 239(�)
DEBUG	Decoding completed: False, sum_logprobs: [-1.5994747877120972], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监�
DEBUG	[682] most att frames
DEBUG	current tokenstorch.Size([1, 52])
DEBUG	attn: torch.Size([1, 51, 719]), current pos: 682, current token: 18637(�)
DEBUG	Decoding completed: False, sum_logprobs: [-1.6033873558044434], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱
DEBUG	[692] most att frames
DEBUG	current tokenstorch.Size([1, 53])
DEBUG	attn: torch.Size([1, 52, 719]), current pos: 692, current token: 109(�)
DEBUG	Decoding completed: False, sum_logprobs: [-1.6459453105926514], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技
DEBUG	[699] most att frames
DEBUG	current tokenstorch.Size([1, 54])
DEBUG	attention reaches the end: 699/719
INFO	End of decoding loop
DEBUG	new_hypothesis: [11, 5419, 239, 18637, 109]
INFO	Output: ,监狱
DEBUG	TS-WORD-INFO: {'start': 13.280000000000001, 'end': 13.280000000000001, 'text': ',', 'tokens': [11]}
DEBUG	TS-WORD-INFO: {'start': 13.38, 'end': 13.5, 'text': '监', 'tokens': [5419, 239]}
DEBUG	TS-WORD-INFO: {'start': 13.64, 'end': 13.84, 'text': '狱', 'tokens': [18637, 109]}
DEBUG	14400.0000 13280 13840 ,监狱
14400.0000 13280 13840 ,监狱
INFO	## last processed 14.40s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 53)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.02989516593515873], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技
DEBUG	[699] most att frames
DEBUG	current tokenstorch.Size([1, 54])
DEBUG	attn: torch.Size([1, 53, 779]), current pos: 699, current token: 32502(技)
DEBUG	Decoding completed: False, sum_logprobs: [-0.03184281662106514], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技�
DEBUG	[712] most att frames
DEBUG	current tokenstorch.Size([1, 55])
DEBUG	attn: torch.Size([1, 54, 779]), current pos: 712, current token: 1474(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.0319046825170517], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术
DEBUG	[717] most att frames
DEBUG	current tokenstorch.Size([1, 56])
DEBUG	attn: torch.Size([1, 55, 779]), current pos: 717, current token: 107(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.05502643063664436], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的
DEBUG	[720] most att frames
DEBUG	current tokenstorch.Size([1, 57])
DEBUG	attn: torch.Size([1, 56, 779]), current pos: 720, current token: 1546(的)
DEBUG	Decoding completed: False, sum_logprobs: [-0.06792913377285004], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发
DEBUG	[730] most att frames
DEBUG	current tokenstorch.Size([1, 58])
DEBUG	attn: torch.Size([1, 57, 779]), current pos: 730, current token: 28926(发)
DEBUG	Decoding completed: False, sum_logprobs: [-0.0680989921092987], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展
DEBUG	[743] most att frames
DEBUG	current tokenstorch.Size([1, 59])
DEBUG	attn: torch.Size([1, 58, 779]), current pos: 743, current token: 43491(展)
DEBUG	Decoding completed: False, sum_logprobs: [-0.09253393858671188], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和
DEBUG	[758] most att frames
DEBUG	current tokenstorch.Size([1, 60])
DEBUG	attention reaches the end: 758/779
INFO	End of decoding loop
DEBUG	new_hypothesis: [32502, 1474, 107, 1546, 28926, 43491]
INFO	Output: 技术的发展
DEBUG	TS-WORD-INFO: {'start': 13.98, 'end': 13.98, 'text': '技', 'tokens': [32502]}
DEBUG	TS-WORD-INFO: {'start': 14.24, 'end': 14.34, 'text': '术', 'tokens': [1474, 107]}
DEBUG	TS-WORD-INFO: {'start': 14.4, 'end': 14.4, 'text': '的', 'tokens': [1546]}
DEBUG	TS-WORD-INFO: {'start': 14.6, 'end': 14.6, 'text': '发', 'tokens': [28926]}
DEBUG	TS-WORD-INFO: {'start': 14.86, 'end': 14.86, 'text': '展', 'tokens': [43491]}
DEBUG	15600.0000 13980 14860 技术的发展
15600.0000 13980 14860 技术的发展
INFO	## last processed 15.60s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 59)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.006240880116820335], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和
DEBUG	[759] most att frames
DEBUG	current tokenstorch.Size([1, 60])
DEBUG	attn: torch.Size([1, 59, 839]), current pos: 759, current token: 12565(和)
DEBUG	Decoding completed: False, sum_logprobs: [-0.03280556946992874], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地
DEBUG	[776] most att frames
DEBUG	current tokenstorch.Size([1, 61])
DEBUG	attn: torch.Size([1, 60, 839]), current pos: 776, current token: 10928(地)
DEBUG	Decoding completed: False, sum_logprobs: [-0.09842270612716675], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地�
DEBUG	[788] most att frames
DEBUG	current tokenstorch.Size([1, 62])
DEBUG	attn: torch.Size([1, 61, 839]), current pos: 788, current token: 38109(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.09909339249134064], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘
DEBUG	[794] most att frames
DEBUG	current tokenstorch.Size([1, 63])
DEBUG	attn: torch.Size([1, 62, 839]), current pos: 794, current token: 246(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.10653717815876007], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治
DEBUG	[798] most att frames
DEBUG	current tokenstorch.Size([1, 64])
DEBUG	attn: torch.Size([1, 63, 839]), current pos: 798, current token: 47456(政治)
DEBUG	Decoding completed: False, sum_logprobs: [-0.23752045631408691], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的
DEBUG	[821] most att frames
DEBUG	current tokenstorch.Size([1, 65])
DEBUG	attention reaches the end: 821/839
INFO	End of decoding loop
DEBUG	new_hypothesis: [12565, 10928, 38109, 246, 47456]
INFO	Output: 和地缘政治
DEBUG	TS-WORD-INFO: {'start': 15.18, 'end': 15.18, 'text': '和', 'tokens': [12565]}
DEBUG	TS-WORD-INFO: {'start': 15.52, 'end': 15.52, 'text': '地', 'tokens': [10928]}
DEBUG	TS-WORD-INFO: {'start': 15.76, 'end': 15.88, 'text': '缘', 'tokens': [38109, 246]}
DEBUG	TS-WORD-INFO: {'start': 15.96, 'end': 15.96, 'text': '政治', 'tokens': [47456]}
DEBUG	16800.0000 15180 15960 和地缘政治
16800.0000 15180 15960 和地缘政治
INFO	## last processed 16.80s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 64)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.14645624160766602], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的
DEBUG	[818] most att frames
DEBUG	current tokenstorch.Size([1, 65])
DEBUG	attn: torch.Size([1, 64, 899]), current pos: 818, current token: 1546(的)
DEBUG	Decoding completed: False, sum_logprobs: [-0.14832155406475067], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背
DEBUG	[825] most att frames
DEBUG	current tokenstorch.Size([1, 66])
DEBUG	attn: torch.Size([1, 65, 899]), current pos: 825, current token: 46329(背)
DEBUG	Decoding completed: False, sum_logprobs: [-0.15136153995990753], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景
DEBUG	[833] most att frames
DEBUG	current tokenstorch.Size([1, 67])
DEBUG	attn: torch.Size([1, 66, 899]), current pos: 833, current token: 50218(景)
DEBUG	Decoding completed: False, sum_logprobs: [-0.6851038932800293], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景,
DEBUG	[874] most att frames
DEBUG	current tokenstorch.Size([1, 68])
DEBUG	attention reaches the end: 874/899
INFO	End of decoding loop
DEBUG	new_hypothesis: [1546, 46329, 50218]
INFO	Output: 的背景
DEBUG	TS-WORD-INFO: {'start': 16.36, 'end': 16.36, 'text': '的', 'tokens': [1546]}
DEBUG	TS-WORD-INFO: {'start': 16.5, 'end': 16.5, 'text': '背', 'tokens': [46329]}
DEBUG	TS-WORD-INFO: {'start': 16.66, 'end': 16.66, 'text': '景', 'tokens': [50218]}
DEBUG	18000.0000 16360 16660 的背景
18000.0000 16360 16660 的背景
INFO	## last processed 18.00s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 67)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.5490235090255737], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府
DEBUG	[874] most att frames
DEBUG	current tokenstorch.Size([1, 68])
DEBUG	attn: torch.Size([1, 67, 959]), current pos: 874, current token: 41116(政府)
DEBUG	Decoding completed: False, sum_logprobs: [-0.5813121795654297], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经
DEBUG	[903] most att frames
DEBUG	current tokenstorch.Size([1, 69])
DEBUG	attn: torch.Size([1, 68, 959]), current pos: 903, current token: 49161(已经)
DEBUG	Decoding completed: False, sum_logprobs: [-0.5989984273910522], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得
DEBUG	[927] most att frames
DEBUG	current tokenstorch.Size([1, 70])
DEBUG	attn: torch.Size([1, 69, 959]), current pos: 927, current token: 5916(得)
DEBUG	Decoding completed: False, sum_logprobs: [-0.60988450050354], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出
DEBUG	[945] most att frames
DEBUG	current tokenstorch.Size([1, 71])
DEBUG	attention reaches the end: 945/959
INFO	End of decoding loop
DEBUG	new_hypothesis: [41116, 49161, 5916]
INFO	Output: 政府已经得
DEBUG	TS-WORD-INFO: {'start': 17.48, 'end': 17.48, 'text': '政府', 'tokens': [41116]}
DEBUG	TS-WORD-INFO: {'start': 18.06, 'end': 18.06, 'text': '已经', 'tokens': [49161]}
DEBUG	TS-WORD-INFO: {'start': 18.54, 'end': 18.54, 'text': '得', 'tokens': [5916]}
DEBUG	19200.0000 17480 18540 政府已经得
19200.0000 17480 18540 政府已经得
INFO	## last processed 19.20s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 70)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.003585459664463997], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出
DEBUG	[945] most att frames
DEBUG	current tokenstorch.Size([1, 71])
DEBUG	attn: torch.Size([1, 70, 1019]), current pos: 945, current token: 7781(出)
DEBUG	Decoding completed: False, sum_logprobs: [-0.028751634061336517], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结
DEBUG	[963] most att frames
DEBUG	current tokenstorch.Size([1, 72])
DEBUG	attn: torch.Size([1, 71, 1019]), current pos: 963, current token: 45641(结)
DEBUG	Decoding completed: False, sum_logprobs: [-0.029241107404232025], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结�
DEBUG	[973] most att frames
DEBUG	current tokenstorch.Size([1, 73])
DEBUG	attn: torch.Size([1, 72, 1019]), current pos: 973, current token: 7422(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.031195063143968582], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论
DEBUG	[979] most att frames
DEBUG	current tokenstorch.Size([1, 74])
DEBUG	attn: torch.Size([1, 73, 1019]), current pos: 979, current token: 118(�)
DEBUG	Decoding completed: True, sum_logprobs: [-1.0442546606063843], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论<|endoftext|>
DEBUG	[1002] most att frames
DEBUG	current tokenstorch.Size([1, 75])
INFO	End of decoding loop
DEBUG	new_hypothesis: [7781, 45641, 7422, 118]
INFO	Output: 出结论
DEBUG	TS-WORD-INFO: {'start': 18.900000000000002, 'end': 18.900000000000002, 'text': '出', 'tokens': [7781]}
DEBUG	TS-WORD-INFO: {'start': 19.26, 'end': 19.26, 'text': '结', 'tokens': [45641]}
DEBUG	TS-WORD-INFO: {'start': 19.46, 'end': 19.580000000000002, 'text': '论', 'tokens': [7422, 118]}
DEBUG	20400.0000 18900 19580 出结论
20400.0000 18900 19580 出结论
INFO	## last processed 20.40s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 74)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.6126465201377869], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,
DEBUG	[1002] most att frames
DEBUG	current tokenstorch.Size([1, 75])
DEBUG	attn: torch.Size([1, 74, 1079]), current pos: 1002, current token: 11(,)
DEBUG	Decoding completed: False, sum_logprobs: [-0.6359277367591858], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有
DEBUG	[1011] most att frames
DEBUG	current tokenstorch.Size([1, 76])
DEBUG	attn: torch.Size([1, 75, 1079]), current pos: 1011, current token: 2412(有)
DEBUG	Decoding completed: False, sum_logprobs: [-0.6382819414138794], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必
DEBUG	[1023] most att frames
DEBUG	current tokenstorch.Size([1, 77])
DEBUG	attn: torch.Size([1, 76, 1079]), current pos: 1023, current token: 28531(必)
DEBUG	Decoding completed: False, sum_logprobs: [-0.640038013458252], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要
DEBUG	[1037] most att frames
DEBUG	current tokenstorch.Size([1, 78])
DEBUG	attn: torch.Size([1, 77, 1079]), current pos: 1037, current token: 4275(要)
DEBUG	Decoding completed: False, sum_logprobs: [-0.6617368459701538], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要�
DEBUG	[1051] most att frames
DEBUG	current tokenstorch.Size([1, 79])
DEBUG	attn: torch.Size([1, 78, 1079]), current pos: 1051, current token: 3416(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.6620143055915833], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩
DEBUG	[1054] most att frames
DEBUG	current tokenstorch.Size([1, 80])
DEBUG	attention reaches the end: 1054/1079
INFO	End of decoding loop
DEBUG	new_hypothesis: [11, 2412, 28531, 4275, 3416]
INFO	Output: ,有必要�
DEBUG	Hiding incomplete unicode character: [3416]
DEBUG	TS-WORD-INFO: {'start': 20.04, 'end': 20.04, 'text': ',', 'tokens': [11]}
DEBUG	TS-WORD-INFO: {'start': 20.04, 'end': 20.04, 'text': '有', 'tokens': [2412]}
DEBUG	TS-WORD-INFO: {'start': 20.22, 'end': 20.22, 'text': '必', 'tokens': [28531]}
DEBUG	TS-WORD-INFO: {'start': 20.46, 'end': 20.46, 'text': '要', 'tokens': [4275]}
DEBUG	21600.0000 20040 20460 ,有必要
21600.0000 20040 20460 ,有必要
INFO	## last processed 21.60s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 79)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要�
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.00024351492174901068], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩
DEBUG	[1055] most att frames
DEBUG	current tokenstorch.Size([1, 80])
DEBUG	attn: torch.Size([1, 79, 1139]), current pos: 1055, current token: 102(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.007092067506164312], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大
DEBUG	[1068] most att frames
DEBUG	current tokenstorch.Size([1, 81])
DEBUG	attn: torch.Size([1, 80, 1139]), current pos: 1068, current token: 3582(大)
DEBUG	Decoding completed: False, sum_logprobs: [-0.11383333802223206], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现
DEBUG	[1086] most att frames
DEBUG	current tokenstorch.Size([1, 82])
DEBUG	attn: torch.Size([1, 81, 1139]), current pos: 1086, current token: 20204(现)
DEBUG	Decoding completed: False, sum_logprobs: [-0.11807592213153839], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有
DEBUG	[1101] most att frames
DEBUG	current tokenstorch.Size([1, 83])
DEBUG	attn: torch.Size([1, 82, 1139]), current pos: 1101, current token: 2412(有)
DEBUG	Decoding completed: False, sum_logprobs: [-0.13030891120433807], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的
DEBUG	[1110] most att frames
DEBUG	current tokenstorch.Size([1, 84])
DEBUG	attn: torch.Size([1, 83, 1139]), current pos: 1110, current token: 1546(的)
DEBUG	Decoding completed: False, sum_logprobs: [-0.14859160780906677], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特
DEBUG	[1135] most att frames
DEBUG	current tokenstorch.Size([1, 85])
DEBUG	attention reaches the end: 1135/1139
INFO	End of decoding loop
DEBUG	new_hypothesis: [102, 3582, 20204, 2412, 1546]
INFO	Output: �大现有的
DEBUG	Hiding incomplete unicode character: [3416]
DEBUG	TS-WORD-INFO: {'start': 21.1, 'end': 21.36, 'text': '扩', 'tokens': [3416, 102]}
DEBUG	TS-WORD-INFO: {'start': 21.72, 'end': 21.72, 'text': '大', 'tokens': [3582]}
DEBUG	TS-WORD-INFO: {'start': 22.02, 'end': 22.02, 'text': '现', 'tokens': [20204]}
DEBUG	TS-WORD-INFO: {'start': 22.2, 'end': 22.2, 'text': '有', 'tokens': [2412]}
DEBUG	TS-WORD-INFO: {'start': 22.7, 'end': 22.7, 'text': '的', 'tokens': [1546]}
DEBUG	22800.0000 21100 22700 扩大现有的
22800.0000 21100 22700 扩大现有的
INFO	## last processed 22.80s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 84)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.006138044875115156], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特
DEBUG	[1132] most att frames
DEBUG	current tokenstorch.Size([1, 85])
DEBUG	attn: torch.Size([1, 84, 1199]), current pos: 1132, current token: 17682(特)
DEBUG	Decoding completed: False, sum_logprobs: [-0.014369450509548187], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定
DEBUG	[1140] most att frames
DEBUG	current tokenstorch.Size([1, 86])
DEBUG	attn: torch.Size([1, 85, 1199]), current pos: 1140, current token: 12088(定)
DEBUG	Decoding completed: False, sum_logprobs: [-0.02789849042892456], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半
DEBUG	[1153] most att frames
DEBUG	current tokenstorch.Size([1, 87])
DEBUG	attn: torch.Size([1, 86, 1199]), current pos: 1153, current token: 30018(半)
DEBUG	Decoding completed: False, sum_logprobs: [-0.028512826189398766], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半�
DEBUG	[1164] most att frames
DEBUG	current tokenstorch.Size([1, 88])
DEBUG	attn: torch.Size([1, 87, 1199]), current pos: 1164, current token: 4510(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.028618082404136658], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导
DEBUG	[1171] most att frames
DEBUG	current tokenstorch.Size([1, 89])
DEBUG	attn: torch.Size([1, 88, 1199]), current pos: 1171, current token: 120(�)
DEBUG	Decoding completed: False, sum_logprobs: [-0.03141879290342331], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体
DEBUG	[1174] most att frames
DEBUG	current tokenstorch.Size([1, 90])
DEBUG	attention reaches the end: 1174/1199
INFO	End of decoding loop
DEBUG	new_hypothesis: [17682, 12088, 30018, 4510, 120]
INFO	Output: 特定半导
DEBUG	TS-WORD-INFO: {'start': 22.64, 'end': 22.64, 'text': '特', 'tokens': [17682]}
DEBUG	TS-WORD-INFO: {'start': 22.8, 'end': 22.8, 'text': '定', 'tokens': [12088]}
DEBUG	TS-WORD-INFO: {'start': 23.06, 'end': 23.06, 'text': '半', 'tokens': [30018]}
DEBUG	TS-WORD-INFO: {'start': 23.28, 'end': 23.42, 'text': '导', 'tokens': [4510, 120]}
DEBUG	24000.0000 22701 23420 特定半导
24000.0000 22701 23420 特定半导
INFO	## last processed 24.00s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 89)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.003415229730308056], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体
DEBUG	[1174] most att frames
DEBUG	current tokenstorch.Size([1, 90])
DEBUG	attn: torch.Size([1, 89, 1259]), current pos: 1174, current token: 29485(体)
DEBUG	Decoding completed: False, sum_logprobs: [-0.3134910464286804], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,
DEBUG	[1228] most att frames
DEBUG	current tokenstorch.Size([1, 91])
DEBUG	attn: torch.Size([1, 90, 1259]), current pos: 1228, current token: 11(,)
DEBUG	Decoding completed: True, sum_logprobs: [-0.8580042123794556], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,<|endoftext|>
DEBUG	[1224] most att frames
DEBUG	current tokenstorch.Size([1, 92])
INFO	End of decoding loop
DEBUG	new_hypothesis: [29485, 11]
INFO	Output: 体,
DEBUG	TS-WORD-INFO: {'start': 23.48, 'end': 23.48, 'text': '体', 'tokens': [29485]}
DEBUG	TS-WORD-INFO: {'start': 24.560000000000002, 'end': 24.560000000000002, 'text': ',', 'tokens': [11]}
DEBUG	25200.0000 23480 24560 体,
25200.0000 23480 24560 体,
INFO	## last processed 25.20s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 91)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-1.0715618133544922], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道
DEBUG	[1237] most att frames
DEBUG	current tokenstorch.Size([1, 92])
DEBUG	attn: torch.Size([1, 91, 1319]), current pos: 1237, current token: 7758(知道)
DEBUG	Decoding completed: False, sum_logprobs: [-1.0798907279968262], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道�
DEBUG	[1249] most att frames
DEBUG	current tokenstorch.Size([1, 93])
DEBUG	attn: torch.Size([1, 92, 1319]), current pos: 1249, current token: 7422(�)
DEBUG	Decoding completed: False, sum_logprobs: [-1.0803321599960327], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设
DEBUG	[1273] most att frames
DEBUG	current tokenstorch.Size([1, 94])
DEBUG	attn: torch.Size([1, 93, 1319]), current pos: 1273, current token: 122(�)
DEBUG	Decoding completed: False, sum_logprobs: [-1.0804692506790161], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设�
DEBUG	[1260] most att frames
DEBUG	current tokenstorch.Size([1, 95])
DEBUG	attn: torch.Size([1, 94, 1319]), current pos: 1260, current token: 1787(�)
DEBUG	Decoding completed: False, sum_logprobs: [-1.0806031227111816], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设备
DEBUG	[1264] most att frames
DEBUG	current tokenstorch.Size([1, 96])
DEBUG	attn: torch.Size([1, 95, 1319]), current pos: 1264, current token: 229(�)
DEBUG	Decoding completed: False, sum_logprobs: [-1.0874733924865723], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设备的
DEBUG	[1269] most att frames
DEBUG	current tokenstorch.Size([1, 97])
DEBUG	attn: torch.Size([1, 96, 1319]), current pos: 1269, current token: 1546(的)
DEBUG	Decoding completed: False, sum_logprobs: [-1.096034288406372], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设备的出
DEBUG	[1278] most att frames
DEBUG	current tokenstorch.Size([1, 98])
DEBUG	attn: torch.Size([1, 97, 1319]), current pos: 1278, current token: 7781(出)
DEBUG	Decoding completed: False, sum_logprobs: [-1.1008656024932861], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设备的出口
DEBUG	[1289] most att frames
DEBUG	current tokenstorch.Size([1, 99])
DEBUG	attn: torch.Size([1, 98, 1319]), current pos: 1289, current token: 18144(口)
DEBUG	Decoding completed: False, sum_logprobs: [-1.1038858890533447], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设备的出口管
DEBUG	[1300] most att frames
DEBUG	current tokenstorch.Size([1, 100])
DEBUG	attention reaches the end: 1300/1319
INFO	End of decoding loop
DEBUG	new_hypothesis: [7758, 7422, 122, 1787, 229, 1546, 7781, 18144]
INFO	Output: 知道设备的出口
DEBUG	TS-WORD-INFO: {'start': 24.740000000000002, 'end': 24.740000000000002, 'text': '知道', 'tokens': [7758]}
DEBUG	TS-WORD-INFO: {'start': 24.98, 'end': 25.46, 'text': '设', 'tokens': [7422, 122]}
DEBUG	TS-WORD-INFO: {'start': 25.2, 'end': 25.28, 'text': '备', 'tokens': [1787, 229]}
DEBUG	TS-WORD-INFO: {'start': 25.38, 'end': 25.38, 'text': '的', 'tokens': [1546]}
DEBUG	TS-WORD-INFO: {'start': 25.560000000000002, 'end': 25.560000000000002, 'text': '出', 'tokens': [7781]}
DEBUG	TS-WORD-INFO: {'start': 25.78, 'end': 25.78, 'text': '口', 'tokens': [18144]}
DEBUG	26400.0000 24740 25780 知道设备的出口
26400.0000 24740 25780 知道设备的出口
INFO	## last processed 26.40s
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 99)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设备的出口
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.001383777242153883], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设备的出口管
DEBUG	[1300] most att frames
DEBUG	current tokenstorch.Size([1, 100])
DEBUG	attn: torch.Size([1, 99, 1347]), current pos: 1300, current token: 23131(管)
DEBUG	Decoding completed: False, sum_logprobs: [-0.002858500462025404], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设备的出口管制
DEBUG	[1314] most att frames
DEBUG	current tokenstorch.Size([1, 101])
DEBUG	attn: torch.Size([1, 100, 1347]), current pos: 1314, current token: 25491(制)
DEBUG	Decoding completed: False, sum_logprobs: [-0.32788893580436707], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设备的出口管制。
DEBUG	[1346] most att frames
DEBUG	current tokenstorch.Size([1, 102])
DEBUG	attention reaches the end: 1346/1347
INFO	End of decoding loop
DEBUG	new_hypothesis: [23131, 25491]
INFO	Output: 管制
DEBUG	TS-WORD-INFO: {'start': 26.0, 'end': 26.0, 'text': '管', 'tokens': [23131]}
DEBUG	TS-WORD-INFO: {'start': 26.28, 'end': 26.28, 'text': '制', 'tokens': [25491]}
DEBUG	26942.6875 26000 26280 管制
26942.6875 26000 26280 管制
INFO	## last processed 26.94s
INFO	Finish
INFO	Trimming context
INFO	Context text:
INFO	Context after trim:  (len: 101)
DEBUG	debug print current_tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设备的出口管制
INFO	Decoding loop starts

DEBUG	Decoding completed: False, sum_logprobs: [-0.1171206459403038], tokens:
DEBUG	<|startoftranscript|><|zh|><|transcribe|><|notimestamps|>格兰发布了一份主题为宣布即将对先进半导体知道设备抬取的出口管制措施的公告表示,监狱技术的发展和地缘政治的背景政府已经得出结论,有必要扩大现有的特定半导体,知道设备的出口管制。
DEBUG	[1346] most att frames
DEBUG	current tokenstorch.Size([1, 102])
DEBUG	attention reaches the end: 1346/1347
INFO	End of decoding loop
DEBUG	new_hypothesis: []
INFO	Output:
DEBUG	Refreshing segment:
DEBUG	init tokens, 23
DEBUG	init tokens after, 23
DEBUG	Context: <token_buffer.TokenBuffer object at 0x129e0c770>
DEBUG	removing all segments.
DEBUG	No text in this segment
```


## 服务器 -- 来自麦克风的实时流

```bash
python simulstreaming_whisper_server.py \
  --host 0.0.0.0 --port 8000 \
  --model_path ~/.cache/whisper/small.pt \
  --lan zh \
  --task transcribe
```

### 客户端

- Linux

```bash
arecord -f S16_LE -c1 -r 16000 -t raw -D default | nc localhost 8000
```

- macOS

```bash
ffmpeg -hide_banner -f avfoundation -i ":0" -ac 1 -ar 16000 -f s16le -loglevel error - | nc localhost 8000
```
> 没能识别出文字


## 参考资料
- [SimulStreaming](https://github.com/ufal/SimulStreaming)
- [Mac client example #123](https://github.com/ufal/whisper_streaming/pull/123)
- [add sounddevice multiplatform client #111](https://github.com/ufal/whisper_streaming/pull/111)
- [whisper_streaming](https://github.com/ufal/whisper_streaming)
