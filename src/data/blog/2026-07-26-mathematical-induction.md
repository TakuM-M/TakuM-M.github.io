---
title: 数学的帰納法の証明
description: 代数学はLLMへのプロンプトに繋がる
pubDate: 2026-07-26
tags:
  - math
---

最近、代数学の重要性に気がつきました。（気づかされました）
まだ全然始めたばかりではあるのですが、
最近やった数学的帰納法の証明について、ここに書いてみたいと思います。
Markdownで綺麗な数式とかかけるのかがわからないけどやってみます。
拙いところも多々あるかと思いますが多めにみてください。

まず、自然数の整列性を前提として認める（以下 $0 \in \mathbb{N}$）。
$$
  \forall L \subset \mathbb{N},\; L \neq \emptyset \Rightarrow \exists d,\; d = \min L
  \tag{1}
$$
そのうえで、$S \subset \mathbb{N}$ が
$$
  0 \in S
  \tag{2}
$$
$$
  \forall k \in \mathbb{N},\; k \in S \Rightarrow k + 1 \in S
  \tag{3}
$$
をともに満たすのならば、 $S = \mathbb{N}$ が成り立つ。
これが数学的帰納法です。

## 背理法を用いて証明
$S \neq \mathbb{N}$ を仮定し矛盾を示す。
$L = \mathbb{N} \setminus S$ という集合を考えたとき、$L$ は次のように定義される。
$$
  L = \{ x \mid x \in \mathbb{N} \land x \notin S \}
  \tag{4}
$$
$S \neq \mathbb{N}$ の仮定より $L \neq \emptyset$ なので、(1) より $L$ には最小元 $\exists d, d = \min L$ が存在する。\
(2) より $0 \in S$ であり、(4) より $0 \notin L$ となるから $d \neq 0$、すなわち $d - 1 \in \mathbb{N}$ が言える。\
$d$ は $L$ の最小元なので $d - 1 \notin L$ であり、(4) より $d - 1 \in S$ となる。\
よって (3) より $d - 1 \in S \Rightarrow d \in S$ が成り立つ。
しかし、$d \in L$ であるため $d \notin S$ となり、矛盾する。

よって、$S = \mathbb{N}$ が成り立つことが示される。

## なぜ代数学が役立つ
上記のような集合としての捉え方や考え方が、LLMへのプロンプトを書く際に大いに役立つそうです。
というのも、集合論での考え方って難しいことを抽象的に捉えれて、LLMに限らず人にうまく物事を伝えられるようになるからです。\
　まだ全然始めたばかりではあるものの、日常会話ですらその効果を感じています。きっと、代数学を極めた先には相当な言語能力へと繋がるのではないかと思います。